using Backend.DTO.User;
using Backend.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _IUserService;

        public UserController(IUserService IUserService)
        {
            _IUserService = IUserService;
        }

        [HttpGet]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await _IUserService.GetAllAsync());
        }
        [HttpGet("lock")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetLockListAsync()
        {
            return Ok(await _IUserService.GetLockListAsync());
        }
        [HttpGet("unlock")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetUnLockListAsync()
        {
            return Ok(await _IUserService.GetUnLockListAsync());
        }
        [HttpGet("deleted")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetDeleteListAsync()
        {
            return Ok(await _IUserService.GetDeleteListAsync());
        }
        [HttpGet("Userinfo/{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetUserInfoAsync(int id)
        {
            return Ok(await _IUserService.GetUserInfoAsync(id));
        }
        [HttpPut("Userinfo/{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> UpdateUserAsync(int id ,UpdateUserRequest request)
        {
            return Ok(await _IUserService.UpdateUserAsync(id,request));
        }

        [HttpPost]
        [Authorize(Roles = "QuanTriVien")]
        
        public async Task<IActionResult> Create(CreateUserRequest request)
        {
            await _IUserService.CreateAsync(request);
            return Ok("Tạo người dùng thành công");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Update(int id, UpdateUserRequest request)
        {
            await _IUserService.UpdateAdminAsync(id, request);
            return Ok("Cập nhật thành công");
        }

        [HttpPut("{id}/lock")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Lock(int id)
        {
            await _IUserService.LockAsync(id);
            return Ok("Đã khóa tài khoản");
        }

        [HttpPut("{id}/unlock")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Unlock(int id)
        {
            await _IUserService.UnLockAsync(id);
            return Ok("Đã mở khóa tài khoản");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            await _IUserService.DeleteAsync(id);
            return Ok("Đã xóa mềm");
        }

        [HttpPut("{id}/restore")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Restore(int id)
        {
            await _IUserService.RestoreAsync(id);
            return Ok("Đã khôi phục tài khoản");
        }
    }
}
