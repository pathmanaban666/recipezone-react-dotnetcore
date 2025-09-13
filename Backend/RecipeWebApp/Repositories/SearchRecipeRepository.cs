using RecipeWebApp.Data;
using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public class SearchRecipeRepository : ISearchRecipeRepository
    {
        private readonly ApplicationDbContext _context;

        public SearchRecipeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddSearchRecipeAsync(SearchRecipe recipe)
        {
            _context.SearchRecipes.Add(recipe);
            await _context.SaveChangesAsync();
        }
    }
}
