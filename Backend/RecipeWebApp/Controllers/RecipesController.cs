using Microsoft.AspNetCore.Mvc;
using RecipeWebApp.DTOs;
using RecipeWebApp.Models;
using RecipeWebApp.Repositories;
using RecipeWebApp.Services;
using System.Security.Claims;

namespace RecipeWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly CloudinaryService _cloudinaryService;

        public RecipesController(IRecipeRepository recipeRepository, CloudinaryService cloudinaryService)
        {
            _recipeRepository = recipeRepository;
            _cloudinaryService = cloudinaryService;
        }

        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found.");
            }
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromForm] RecipeCreateDto recipeDto)
        {
            if (recipeDto == null)
                return BadRequest("Invalid data.");

            string imageUrl = null;

            if (recipeDto.Image != null)
            {
                imageUrl = await _cloudinaryService.UploadImageAsync(recipeDto.Image);
            }

            var user_Id = GetUserId();

            var recipe = new Recipe
            {
                Title = recipeDto.Title,
                Description = recipeDto.Description,
                Ingredients = recipeDto.Ingredients,
                Instructions = recipeDto.Instructions,
                ImageUrl = imageUrl,
                IsPublic = recipeDto.IsPublic,
                UserId = user_Id
            };

            await _recipeRepository.AddAsync(recipe);

            var recipeDtoResponse = new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                IsPublic = recipe.IsPublic
            };

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipeDtoResponse);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe == null)
                return NotFound();

            var recipeDto = new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                IsPublic = recipe.IsPublic
            };

            return Ok(recipeDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromForm] RecipeUpdateDto recipeDto)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe == null)
                return NotFound();

            if (recipe.UserId != GetUserId())
                return Forbid("You are not authorized to update this recipe.");

            if (recipeDto.Image != null)
            {
                recipe.ImageUrl = await _cloudinaryService.UploadImageAsync(recipeDto.Image);
            }
         
            recipe.Title = recipeDto.Title ?? recipe.Title;
            recipe.Description = recipeDto.Description ?? recipe.Description;
            recipe.Ingredients = recipeDto.Ingredients ?? recipe.Ingredients;
            recipe.Instructions = recipeDto.Instructions ?? recipe.Instructions;
            recipe.IsPublic = recipeDto.IsPublic;

            await _recipeRepository.UpdateAsync(recipe);

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe == null)
                return NotFound();

            if (recipe.UserId != GetUserId())
                return Forbid("You are not authorized to delete this recipe.");

            await _recipeRepository.DeleteAsync(recipe);
            return NoContent();
        }


        [HttpGet("user")]
        public async Task<IActionResult> GetUserRecipes()
        {
            var userId = GetUserId();
            var recipes = await _recipeRepository.GetByUserIdAsync(userId);

            var recipeDtos = recipes.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                IsPublic = recipe.IsPublic
            });

            return Ok(recipeDtos);
        }


        [HttpGet("public")]
        public async Task<IActionResult> GetPublicRecipes()
        {
            var publicRecipes = await _recipeRepository.GetPublicRecipesAsync();

            var recipeDtos = publicRecipes.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                IsPublic = recipe.IsPublic,
                Username = recipe.User?.UserName 
            });

            return Ok(recipeDtos);
        }

        [HttpGet("public/{id}")]
        public async Task<IActionResult> GetPublicRecipeById(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);

            if (recipe == null || !recipe.IsPublic)
                return NotFound();

            var recipeDto = new RecipeDto
            {
                Id = recipe.Id,
                Title = recipe.Title,
                Description = recipe.Description,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                IsPublic = recipe.IsPublic,
                Username = recipe.User?.UserName
            };


            return Ok(recipeDto);
        }


    }
}
