using Backend.DTO.User;
using Backend.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.Controller.Client.Public
{
    [ApiController]
    [Route("api/me")]
    [Authorize]
    public class MeController : ControllerBase
    {
        private readonly IUserService _userService;

        public MeController(IUserService userService)
        {
            _userService = userService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        // GET /api/me
        [HttpGet]
        public async Task<IActionResult> GetMyInfo()
        {
            return Ok(await _userService.GetUserInfoAsync(GetUserId()));
        }

        // PUT /api/me
        [HttpPut]
        public async Task<IActionResult> UpdateMyInfo(UpdateUserRequest request)
        {
            return Ok(await _userService.UpdateInfoUserAsync(GetUserId(), request));
        }
        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassWord(ChangePasswordRequest request)
        {
            var result = await _userService.ChangePasswordAsync(GetUserId(), request);

            if (result == null)
                return NotFound("Không tìm thấy người dùng");

            if (result.Message == "Mật khẩu cũ không đúng")
                return Unauthorized(result);

            if (result.Message == "Mật khẩu mới phải khác mật khẩu cũ")
                return BadRequest(result);

            return Ok(result);
        }
    }
}
