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

            var accessToken = _jwtHelper.GenerateToken(
                result.MaNguoiDung,
                result.VaiTro ?? "NguoiDung"
            );

            var refreshToken = _jwtHelper.GenerateRefreshToken(result.MaNguoiDung);

            // Vẫn lưu vào cookie (cho bảo mật)
            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            // ✅ THÊM: Trả token trong response body để frontend có thể lưu vào localStorage
            return Ok(new
            {
                Message = "Đăng nhập thành công",
                MaNguoiDung = result.MaNguoiDung,
                HoTen = result.HoTen,
                Email = request.Email, // ✅ Thêm email
                VaiTro = result.VaiTro,
                Token = accessToken,   // ✅ Thêm token
                Success = true
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
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                Message = "Đăng ký thành công",
                MaNguoiDung = result.MaNguoiDung,
                HoTen = result.HoTen,
                Email = request.Email, // ✅ Thêm email
                VaiTro = result.VaiTro,
                Success = true
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            try
            {
                var principal = _jwtHelper.ValidateRefreshToken(refreshToken);
                var userId = int.Parse(principal.FindFirst("userId")!.Value);

                var user = await _dbContext.NguoiDung
                    .Include(u => u.VaiTro)
                    .FirstOrDefaultAsync(u => u.MaNguoiDung == userId);

                if (user == null || user.TrangThai == false)
                    return Unauthorized();

                var role = user.VaiTro?.TenVaiTro ?? "NguoiDung";
                var newAccessToken = _jwtHelper.GenerateToken(userId, role);

                Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                });

                return Ok(new { message = "Làm mới token" });
            }
            catch
            {
                return Unauthorized();
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refreshToken");

            return Ok(new { message = "Logged out" });
        }
    }
}