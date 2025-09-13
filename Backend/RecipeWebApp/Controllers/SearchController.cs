using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RecipeWebApp.Models;
using RecipeWebApp.Repositories;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace RecipeWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchRecipeRepository _repository;
        private readonly OpenRouterSettings _openRouterSettings;
        private readonly string _apiUrl;
        private readonly string _apiKey;
        private readonly string _apiModelName;

        private readonly HttpClient _httpClient;

        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found.");
            }
            return userId;
        }

        private static readonly Regex BannedKeywordRegex = new Regex(
         @"\b(blog|travel|video|post|story|videos|article|email|newsletter|fiction|ar[a-zA-Z]{1}y|nati[a-zA-Z]{1}n|ha[a-zA-Z]{1}k)\b",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public SearchController(ISearchRecipeRepository repository, IHttpClientFactory httpClientFactory, IOptions<OpenRouterSettings> openRouterOptions)
        {
            _repository = repository;
            _httpClient = httpClientFactory.CreateClient();
            _openRouterSettings = openRouterOptions.Value;

            if (string.IsNullOrWhiteSpace(_openRouterSettings.ApiUrl))
            {
                throw new InvalidOperationException("OpenRouter API URL is missing in configuration.");
            }

            if (!Uri.IsWellFormedUriString(_openRouterSettings.ApiUrl, UriKind.Absolute))
            {
                throw new InvalidOperationException("OpenRouter API URL is not a valid absolute URI.");
            }

            if (string.IsNullOrWhiteSpace(_openRouterSettings.ApiKey))
            {
                throw new InvalidOperationException("OpenRouter API Key is missing in configuration.");
            }

            if (string.IsNullOrWhiteSpace(_openRouterSettings.HttpReferer))
                throw new InvalidOperationException("HTTP Referer is missing in configuration.");

            if (string.IsNullOrWhiteSpace(_openRouterSettings.XTitle))
                throw new InvalidOperationException("X-Title is missing in configuration.");

            _apiUrl = _openRouterSettings.ApiUrl;
            _apiKey = _openRouterSettings.ApiKey;
            _apiModelName = _openRouterSettings.ModelName;
        }


        [HttpPost]
        public async Task<IActionResult> GetRecipe([FromBody] RecipeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.RecipeName) || request.RecipeName.Length < 3)
            {
                return BadRequest(new { Error = "Recipe name is required and must be at least 3 characters." });
            }

            string recipeName = request.RecipeName.Trim();

            //  Rule-based filter
            var recipe = recipeName.ToLower();
            if (BannedKeywordRegex.IsMatch(recipe))
            {
                return BadRequest(new { Error = "The input does not appear to be a valid recipe name." });
            }

            //  Name-based validation
            if (!await IsValidRecipeNameViaAI(recipeName))
            {
                return BadRequest(new { Error = "The input was not recognized as a valid recipe name." });
            }


            var prompt = $"Give me the ingredients and step-by-step instructions to make {recipeName}.";

            var requestBody = new
            {
                model = _apiModelName,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                temperature = 0.7
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey.Trim());
            _httpClient.DefaultRequestHeaders.Remove("HTTP-Referer");
            _httpClient.DefaultRequestHeaders.Remove("X-Title");
            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", _openRouterSettings.HttpReferer);
            _httpClient.DefaultRequestHeaders.Add("X-Title", _openRouterSettings.XTitle);

            var response = await _httpClient.PostAsync(_apiUrl, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, responseString);

            var user_Id = GetUserId();
            var search_Recipe = new SearchRecipe
            {
                RecipeName = recipeName,
                RecipeInfo = responseString,
                UserId = user_Id
            };
            await _repository.AddSearchRecipeAsync(search_Recipe);

            using var doc = JsonDocument.Parse(responseString);
            var contentText = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(new { Instructions = contentText });
        }

        // LLM Validation
        private async Task<bool> IsValidRecipeNameViaAI(string input)
        {
            var prompt = $"Is \"{input}\" a food recipe name? Answer only with 'yes' or 'no'.";

            var requestBody = new
            {
                model = _apiModelName,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                temperature = 0.0
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey.Trim());
            _httpClient.DefaultRequestHeaders.Remove("HTTP-Referer");
            _httpClient.DefaultRequestHeaders.Remove("X-Title");

            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", _openRouterSettings.HttpReferer);
            _httpClient.DefaultRequestHeaders.Add("X-Title", _openRouterSettings.XTitle);

            var response = await _httpClient.PostAsync(_apiUrl, content);
            var responseText = await response.Content.ReadAsStringAsync();



            if (!response.IsSuccessStatusCode)
                return false;

            using var doc = JsonDocument.Parse(responseText);
            var contentText = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()
                ?.Trim().ToLower();

            return Regex.IsMatch(contentText ?? "", @"\byes\b", RegexOptions.IgnoreCase);

        }
    }

    public class RecipeRequest
    {
        public string RecipeName { get; set; } = string.Empty;
    }
}










