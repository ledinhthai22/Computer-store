using Backend.Services.WebInfo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.DTO.WebInfo;

namespace Ecommerce.Controllers.Admin
{
    [Route("api/admin/web-info")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class WebInfoAdminController : ControllerBase
    {
        private readonly IWebInfoService _webInfoService;

        public WebInfoAdminController(IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetForAdmin()
        {
            return Ok(await _webInfoService.GetForAdminAsync());
        }

        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            return Ok(await _webInfoService.GetDeletedAsync());
        }

        
        [HttpPost("create")]
        public async Task<IActionResult> Create(WebInfoCreate request)
        {
            await _webInfoService.CreateAsync(request);
            return Ok(new { message = "Thêm cấu hình thành công" });
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, WebInfoUpdate request)
        {
            var result = await _webInfoService.UpdateAsync(id, request);

            if (result == null)
                return NotFound(new { message = "Không tìm thấy thông tin cần cập nhật" });

            return Ok(new
            {
                message = "Cập nhật thông tin thành công",
                data = result
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _webInfoService.DeleteAsync(id);
            return Ok(new { message = "Xóa thành công" });
        }

        [HttpPut("restore/{id:int}")]
        public async Task<IActionResult> Restore(int id)
        {
            await _webInfoService.RestoreAsync(id);
            return Ok(new { message = "Khôi phục thành công" });
        }
    }
}
