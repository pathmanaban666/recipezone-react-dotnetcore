using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeWebApp.Data;
using RecipeWebApp.Models;
using RecipeWebApp.Repositories;
using RecipeWebApp.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Services
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// 4. JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

if (string.IsNullOrWhiteSpace(jwtKey) || string.IsNullOrWhiteSpace(jwtIssuer))
    throw new Exception("JWT configuration is missing.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// 5. Identity Options
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
});

// 6. Custom Services
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IRecipeVaultRepository, RecipeVaultRepository>();
builder.Services.AddScoped<ISearchRecipeRepository, SearchRecipeRepository>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddSingleton<CloudinaryService>();
builder.Services.Configure<OpenRouterSettings>(builder.Configuration.GetSection("OpenRouter"));
builder.Services.Configure<CorsSettings>(builder.Configuration.GetSection("Cors"));

// 7. CORS
string[] allowedOrigins;

var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>();

if (corsSettings?.AllowedOrigins?.Any() == true)
{
    allowedOrigins = corsSettings.AllowedOrigins;
}
else
{
    var rawOrigins = builder.Configuration["Cors:AllowedOrigins"];
    allowedOrigins = rawOrigins?
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? Array.Empty<string>();
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// 8. Error handling and HSTS (only in production)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts(); 
}
else
{
    // Swagger only in development
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 9. Middleware order
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();   
app.UseAuthorization();

app.MapControllers();
app.Run();
