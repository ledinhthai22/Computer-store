using Ecommerce.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly JwtHelper _jwtHelper;

    public AuthController(JwtHelper jwtHelper)
    {
        _jwtHelper = jwtHelper;
    }

    [HttpPost("login")]
    public IActionResult Login(string email, string password)
    {
        // Giả lập DB
        if (email == "admin@gmail.com" && password == "123")
        {
            return Ok(new
            {
                userId = 1,
                role = "Admin",
                token = _jwtHelper.GenerateToken(1, "Admin")
            });
        }

        // USER
        if (email == "user@gmail.com" && password == "123")
        {
            return Ok(new
            {
                userId = 2,
                role = "User",
                token = _jwtHelper.GenerateToken(2, "User")
            });
        }

        return Unauthorized("Sai email hoặc mật khẩu");
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("delete-test/{id}")]
    public IActionResult DeleteTest(int id)
    {
        return Ok(new
        {
            message = "Xóa thành công (chỉ Admin mới được phép)",
            deletedId = id
        });
    }
}
