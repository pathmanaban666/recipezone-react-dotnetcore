namespace RecipeWebApp.Models
{
    public class OpenRouterSettings
    {
        public string ApiUrl { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string HttpReferer { get; set; } = string.Empty;
        public string XTitle { get; set; } = "RecipeApp";
        public string ModelName { get; set; } = string.Empty;
    }
}
