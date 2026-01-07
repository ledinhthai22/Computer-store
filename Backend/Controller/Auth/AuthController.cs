using Backend.Helper;
using Backend.DTO;
using Backend.Services.Auth;
using Backend.DTO.Auth;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Auth
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly JwtHelper _jwtHelper;
        private readonly ApplicationDbContext _dbContext;
        private readonly IAuthService _authService;

        public AuthController(
            JwtHelper jwtHelper,
            ApplicationDbContext dbContext,
            IAuthService authService)
        {
            _jwtHelper = jwtHelper;
            _dbContext = dbContext;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);
            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            var refreshToken = _jwtHelper.GenerateRefreshToken(result.MaNguoiDung);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, 
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = result.Message,
                hoTen = result.HoTen,
                vaiTro = result.VaiTro
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
                return BadRequest(new { message = result.Message });

            var refreshToken = _jwtHelper.GenerateRefreshToken(result.MaNguoiDung);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = result.Message,
                hoTen = result.HoTen,
                vaiTro = result.VaiTro
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Missing refresh token" });

            try
            {
                var principal = _jwtHelper.ValidateRefreshToken(refreshToken);
                var userId = int.Parse(principal.FindFirst("userId")!.Value);

                var user = await _dbContext.NguoiDung
                    .Include(u => u.VaiTro)
                    .FirstOrDefaultAsync(u => u.MaNguoiDung == userId);

                if (user == null || user.TrangThai == false)
                    return Unauthorized(new { message = "User not found or locked" });

                var role = user.VaiTro?.TenVaiTro ?? "NguoiDung";
                var accessToken = _jwtHelper.GenerateToken(userId, role);

                return Ok(new { accessToken });
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
