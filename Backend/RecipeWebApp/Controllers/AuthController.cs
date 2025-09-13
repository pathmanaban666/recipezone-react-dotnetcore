using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RecipeWebApp.DTOs;
using RecipeWebApp.Models;
using RecipeWebApp.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace RecipeWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IOtpService _otpService;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IOtpService otpService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _otpService = otpService;
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { description = "Email already in use." });

            // Username validation
            if (string.IsNullOrWhiteSpace(dto.Username) || dto.Username.Length < 3 || dto.Username.Length > 20)
                return BadRequest(new { description = "Username must be between 3 and 20 characters." });

            if (!Regex.IsMatch(dto.Username, "^[a-zA-Z0-9_]+$"))
                return BadRequest(new { description = "Username can only contain letters, numbers, and underscores." });

            var existingUsername = await _userManager.FindByNameAsync(dto.Username);
            if (existingUsername != null)
                return BadRequest(new { description = "Username already in use." });

            var tempUser = new User { UserName = dto.Username, Email = dto.Email };
            var passwordValidator = new PasswordValidator<User>();
            var result = await passwordValidator.ValidateAsync(_userManager, tempUser, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => new { description = e.Description }));

            var otp = new Random().Next(100000, 999999).ToString();

            await _otpService.SaveOtpAsync(dto.Email, otp);
            await _otpService.SavePendingRegistrationAsync(dto);

            if (!await _otpService.SendOtpAsync(dto.Email, otp))
                return StatusCode(500, "Failed to send OTP");

            return Ok(new { message = "OTP sent to email. Please verify to complete registration." });
        }




        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            if (!await _otpService.VerifyOtpAsync(dto.Email, dto.Otp))
                return BadRequest(new { description = "Invalid or expired OTP" });

            var pending = await _otpService.GetPendingRegistrationAsync(dto.Email);
            if (pending == null)
                return BadRequest(new { description = "No registration found for this email" });

            var user = new User { UserName = pending.Username, Email = pending.Email };
            var result = await _userManager.CreateAsync(user, pending.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => new { description = e.Description }));

            return Ok(new { message = "Registration successful" });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                var token = GenerateJwtToken(user);
                var username = user.UserName;
                return Ok(new { token, username });
            }

            return Unauthorized("Invalid login");
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

