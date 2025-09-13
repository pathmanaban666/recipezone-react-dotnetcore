using Microsoft.EntityFrameworkCore;
using RecipeWebApp.Data;
using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly ApplicationDbContext _context;
        
        public RecipeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Recipe> GetByIdAsync(int id)
        {
            return await _context.Recipes
                .Include(r => r.User) 
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Recipe>> GetByUserIdAsync(string userId)
        {
            return await _context.Recipes
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Recipe recipe)
        {
            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Recipe recipe)
        {
            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Recipe recipe)
        {
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Recipe>> GetPublicRecipesAsync()
        {
            return await _context.Recipes
                                 .Where(r => r.IsPublic)
                                 .Include(r => r.User)
                                 .ToListAsync();
        }

    }
}
