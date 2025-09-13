using Microsoft.EntityFrameworkCore;
using RecipeWebApp.Data;
using RecipeWebApp.Models;

namespace RecipeWebApp.Repositories
{
    public class RecipeVaultRepository : IRecipeVaultRepository
    {
        private readonly ApplicationDbContext _context;

        public RecipeVaultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RecipeVault recipedata)
        {
            _context.RecipeVaults.Add(recipedata);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RecipeVault>> GetAllAsync(string userId)
        {
            return await _context.RecipeVaults.Where(r => r.UserId == userId)
                .ToListAsync(); 
        }

        public async Task<RecipeVault> GetByIdAsync(int id)
        {
            return await _context.RecipeVaults.Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task DeleteAsync(RecipeVault recipeVault)
        {
            _context.RecipeVaults.Remove(recipeVault);
            await _context.SaveChangesAsync();
        }

    }
}
