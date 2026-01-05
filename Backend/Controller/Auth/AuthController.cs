using Backend.Helper;
using Backend.DTO; 
using Microsoft.AspNetCore.Mvc;
using Backend.Data; 
using Backend.Services.Auth;
using Backend.DTO.Auth;

namespace Backend.Controller.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtHelper _jwtHelper;
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        public AuthController(JwtHelper jwtHelper, ApplicationDbContext context,IAuthService authService)
        {
            _jwtHelper = jwtHelper;
            _context = context;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
            {
                
                return Unauthorized(new { message = result.Message });
            }
            return Ok(new
            {
                Token = result.Token,
                Message = result.Message,
                HoTen = result.HoTen,
                Role = result.VaiTro
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

            return Ok(result);
        }
    }
}