using Microsoft.EntityFrameworkCore;
using RecipeWebApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace RecipeWebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        { }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RecipeVault> RecipeVaults { get; set; }
        public DbSet<SearchRecipe> SearchRecipes { get; set; }
        public DbSet<OtpEntry> OtpEntries { get; set; }
        public DbSet<PendingRegistration> PendingRegistrations { get; set; }
    }
}
