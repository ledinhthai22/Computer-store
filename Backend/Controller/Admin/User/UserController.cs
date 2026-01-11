using Backend.DTO.User;
using Backend.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Policy = "AdminOnly")]
    public class UserAdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserAdminController(IUserService userService)
        {
            _userService = userService;
        }

        // GET /api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _userService.GetAllAsync());
        }

        // GET /api/admin/users/locked
        [HttpGet("locked")]
        public async Task<IActionResult> GetLocked()
        {
            return Ok(await _userService.GetLockListAsync());
        }

        // GET /api/admin/users/unlocked
        [HttpGet("unlocked")]
        public async Task<IActionResult> GetUnlocked()
        {
            return Ok(await _userService.GetUnLockListAsync());
        }

        // GET /api/admin/users/deleted
        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            return Ok(await _userService.GetDeleteListAsync());
        }

        // POST /api/admin/users
        [HttpPost]
        public async Task<IActionResult> Create(CreateUserRequest request)
        {
            await _userService.CreateAsync(request);
            return Ok(new { message = "Tạo người dùng thành công" });
        }

        // PUT /api/admin/users/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateUserRequest request)
        {
            await _userService.UpdateAdminAsync(id, request);
            return Ok(new { message = "Cập nhật thành công" });
        }

        // PUT /api/admin/users/{id}/lock
        [HttpPut("{id:int}/lock")]
        public async Task<IActionResult> Lock(int id)
        {
            await _userService.LockAsync(id);
            return Ok(new { message = "Đã khóa tài khoản" });
        }

        // PUT /api/admin/users/{id}/unlock
        [HttpPut("{id:int}/unlock")]
        public async Task<IActionResult> Unlock(int id)
        {
            await _userService.UnLockAsync(id);
            return Ok(new { message = "Đã mở khóa tài khoản" });
        }

        // DELETE /api/admin/users/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            await _userService.DeleteAsync(id);
            return Ok(new { message = "Đã xóa mềm" });
        }

        // PUT /api/admin/users/{id}/restore
        [HttpPut("{id:int}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            await _userService.RestoreAsync(id);
            return Ok(new { message = "Đã khôi phục tài khoản" });
        }
    }
}
