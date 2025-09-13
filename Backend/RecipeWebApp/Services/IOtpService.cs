using RecipeWebApp.DTOs;

namespace RecipeWebApp.Services
{
    public interface IOtpService
    {
        Task SaveOtpAsync(string email, string otp);
        Task<bool> VerifyOtpAsync(string email, string otp);
        Task SavePendingRegistrationAsync(RegisterDto dto);
        Task<RegisterDto?> GetPendingRegistrationAsync(string email);
        Task<bool> SendOtpAsync(string email, string otp);
    }


}
