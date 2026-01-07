using Backend.Helper;
using Backend.DTO; 
using Microsoft.AspNetCore.Mvc;
using Backend.Data; 
using Backend.Services.Auth;
using Backend.DTO.Auth;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtHelper _jwtHelper;
        private readonly ApplicationDbContext _DbContext;
        private readonly IAuthService _authService;

        public AuthController(JwtHelper jwtHelper, ApplicationDbContext DbContext, IAuthService authService)
        {
            _jwtHelper = jwtHelper;
            _DbContext = DbContext;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            var refreshToken = _authService.GenerateRefreshToken(result.Token != null 
                ? int.Parse(JwtParser.GetUserIdFromToken(result.Token)) : 0);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(request);

            if (!result.Success) return BadRequest(new { message = result.Message });


            var refreshToken = _authService.GenerateRefreshToken(result.Token != null 
                ? int.Parse(JwtParser.GetUserIdFromToken(result.Token)) : 0);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(result);
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Missing refresh token" });

            try
            {
                var principal = _jwtHelper.ValidateRefreshToken(refreshToken);
                var userId = int.Parse(principal.FindFirst("userId")!.Value);

                var user = _DbContext.NguoiDung.Include(u => u.VaiTro)
                                             .FirstOrDefault(u => u.MaNguoiDung == userId);
                string role = user?.VaiTro?.TenVaiTro ?? "NguoiDung";

                var newAccessToken = _jwtHelper.GenerateToken(userId, role);

                return Ok(new { Token = newAccessToken });
            }
            catch
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("refreshToken");
            return Ok(new { message = "Logged out" });
        }
    }
}
