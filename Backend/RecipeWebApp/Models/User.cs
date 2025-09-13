using Microsoft.AspNetCore.Identity;

namespace RecipeWebApp.Models
{

    public class User : IdentityUser
    {
        public ICollection<RecipeVault> UserRecipeVault { get; set; }
    }

}
