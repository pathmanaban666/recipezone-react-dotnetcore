using Microsoft.AspNetCore.Mvc;
using RecipeWebApp.DTOs;
using RecipeWebApp.Models;
using RecipeWebApp.Repositories;
using System.Security.Claims;

namespace RecipeWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeVaultController : Controller
    {
        private readonly IRecipeVaultRepository _repository;

        public RecipeVaultController(IRecipeVaultRepository repository)
        {
            _repository = repository;
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
        public async Task<IActionResult> Create([FromBody] RecipeVaultCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.RecipeName) || string.IsNullOrWhiteSpace(dto.Instructions))
            {
                return BadRequest(new { error = "Invalid recipe data." });
            }

            var user_Id = GetUserId();
            var recipevault = new RecipeVault
            {
                RecipeName = dto.RecipeName,
                Instructions = dto.Instructions,
                UserId= user_Id
            };

            await _repository.AddAsync(recipevault);

            var result = new RecipeVaultDto
            {
                Id = recipevault.Id,
                RecipeName = recipevault.RecipeName,
                Instructions = recipevault.Instructions
            };

            return CreatedAtAction(nameof(GetById), new { id = recipevault.Id }, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            var recipedata = await _repository.GetAllAsync(userId);
            var result = recipedata.Select(c => new RecipeVaultDto
            {
                Id = c.Id,
                RecipeName = c.RecipeName,
                Instructions = c.Instructions
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recipevault = await _repository.GetByIdAsync(id);
            if (recipevault == null)
                return NotFound();

            var dto = new RecipeVaultDto
            {
                Id = recipevault.Id,
                RecipeName = recipevault.RecipeName,
                Instructions = recipevault.Instructions
            };

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var recipe = await _repository.GetByIdAsync(id);

            if (recipe == null || recipe.UserId != userId)
            {
                return NotFound(new { message = "Recipe not found or unauthorized." });
            }

            await _repository.DeleteAsync(recipe);
            return NoContent();
        }

    }
}
