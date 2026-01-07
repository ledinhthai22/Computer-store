using Backend.DTO;
using Backend.DTO.Auth;

namespace Backend.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequest req);
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        string GenerateRefreshToken(int userId);
    }
}
