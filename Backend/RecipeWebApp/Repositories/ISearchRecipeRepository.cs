using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public interface ISearchRecipeRepository
    {
        Task AddSearchRecipeAsync(SearchRecipe recipe);
    }
}
