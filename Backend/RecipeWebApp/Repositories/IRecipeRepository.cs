using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public interface IRecipeRepository
    {
        Task<Recipe> GetByIdAsync(int id);     
        Task<IEnumerable<Recipe>> GetByUserIdAsync(string userId);     
        Task<IEnumerable<Recipe>> GetPublicRecipesAsync();
        Task AddAsync(Recipe recipe);             
        Task UpdateAsync(Recipe recipe);           
        Task DeleteAsync(Recipe recipe);             
    }
}
