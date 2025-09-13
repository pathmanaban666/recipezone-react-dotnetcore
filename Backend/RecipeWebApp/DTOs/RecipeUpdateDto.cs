namespace RecipeWebApp.DTOs
{
    public class RecipeUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Ingredients { get; set; }
        public string? Instructions { get; set; }
        public bool IsPublic { get; set; }
        public IFormFile? Image { get; set; }
    }

}
