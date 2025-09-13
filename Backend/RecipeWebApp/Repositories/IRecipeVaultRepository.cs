using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public interface IRecipeVaultRepository
    {
        Task AddAsync(RecipeVault recipevault);
        Task<IEnumerable<RecipeVault>> GetAllAsync(string userId);
        Task<RecipeVault> GetByIdAsync(int id);
        Task DeleteAsync(RecipeVault recipeVault);

    }
}
