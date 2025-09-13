namespace RecipeWebApp.Models
{
    public class RecipeVault
    {
            public int Id { get; set; }
            public string RecipeName { get; set; }
            public string Instructions { get; set; }
            public string UserId { get; set; }
            public User User { get; set; }

    }

}
