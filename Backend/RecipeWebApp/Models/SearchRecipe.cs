namespace RecipeWebApp.Models
{
    public class SearchRecipe
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string RecipeName { get; set; } = string.Empty;
        public string RecipeInfo { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
