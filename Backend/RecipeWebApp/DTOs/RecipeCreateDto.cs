namespace RecipeWebApp.DTOs
{
    public class RecipeCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Ingredients { get; set; }
        public string Instructions { get; set; }
        public IFormFile Image { get; set; }
        public bool IsPublic { get; set; } = true;

    }

}
