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
            return Ok(await _userService.UpdateUserAsync(GetUserId(), request));
        }
    }
}
