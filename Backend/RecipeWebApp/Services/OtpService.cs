using Microsoft.EntityFrameworkCore;
using NotificationApi.Server;
using NotificationApi.Server.Models;
using RecipeWebApp.Data;
using RecipeWebApp.DTOs;
using RecipeWebApp.Models;
using RecipeWebApp.Services;

public class OtpService : IOtpService
{
    private readonly ApplicationDbContext _context;
    private readonly NotificationApiServer _notificationApi;

    public OtpService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _notificationApi = new NotificationApiServer(
            config["NotificationApi:ClientId"],
            config["NotificationApi:ClientSecret"],
            true,
            "https://api.eu.notificationapi.com"
        );
    }

    public async Task SaveOtpAsync(string email, string otp)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(5);
        var existing = await _context.OtpEntries.FirstOrDefaultAsync(e => e.Email == email);
        if (existing != null)
        {
            existing.OtpCode = otp;
            existing.ExpiresAt = expiresAt;
        }
        else
        {
            _context.OtpEntries.Add(new OtpEntry
            {
                Email = email,
                OtpCode = otp,
                ExpiresAt = expiresAt
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task<bool> VerifyOtpAsync(string email, string otp)
    {
        var entry = await _context.OtpEntries.FirstOrDefaultAsync(e => e.Email == email);
        if (entry == null || entry.ExpiresAt < DateTime.UtcNow || entry.OtpCode != otp)
            return false;

        _context.OtpEntries.Remove(entry);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task SavePendingRegistrationAsync(RegisterDto dto)
    {
        var existing = await _context.PendingRegistrations.FirstOrDefaultAsync(x => x.Email == dto.Email);
        if (existing != null)
        {
            existing.Username = dto.Username;
            existing.Password = dto.Password;
        }
        else
        {
            _context.PendingRegistrations.Add(new PendingRegistration
            {
                Email = dto.Email,
                Username = dto.Username,
                Password = dto.Password
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task<RegisterDto?> GetPendingRegistrationAsync(string email)
    {
        var entity = await _context.PendingRegistrations.FirstOrDefaultAsync(x => x.Email == email);
        if (entity == null)
            return null;

        return new RegisterDto
        {
            Email = entity.Email,
            Username = entity.Username,
            Password = entity.Password
        };
    }

    public async Task<bool> SendOtpAsync(string email, string otp)
    {
        var notification = new SendNotificationData
        {
            NotificationId = "email",
            User = new NotificationUser
            {
                Id = email,
                Email = email
            },
            MergeTags = new Dictionary<string, object>
            {
                { "OTP_CODE", otp }
            }
        };

        try
        {
            await _notificationApi.Send(notification);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[OTP ERROR] Failed to send: {ex.Message}");
            return false;
        }
    }
}


