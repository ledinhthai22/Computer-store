using Backend.Services.WebInfo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.DTO.WebInfo;


namespace Ecommerce.Controller.Admin.WebInfo
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class WebInfoAdminController : ControllerBase
    {
        private readonly IWebInfoService _webInfoService;
        public WebInfoAdminController(IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _webInfoService.GetAllAsync();
            return Ok(result);
        }
        
        [HttpPut("update-status/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateStatus(int id)
        {
            var result = await _webInfoService.UpdateStatus(id);
            if (!result) return NotFound(new { message = "Không tìm thấy thông tin trang hoặc đã bị xóa" });
            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }
        [HttpGet("deleted")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetHidenAsync()
        {
            var result = await _webInfoService.GetAllHidenAsync();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateWebInfo(WebInfoItemRequest request)
        {
            var result = await _webInfoService.CreateWebInfo(request);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateWebInfo(int id, WebInfoItemRequest request)
        {
            var result = await _webInfoService.UpdateWebInfo(id, request);
            if (result == null) return NotFound(new { message = "Không tìm thấy thông tin trang" });
            return Ok(result);
        }

        [HttpPut("restore/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> ReStoreWebInfo(int id)
        {
            var result = await _webInfoService.RestoreWebInfo(id);
            if (result == null) return NotFound(new { message = "Không tìm thấy thông tin trang" });
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            try
            {
                var success = await _webInfoService.SoftDelete(id);
                if (!success) return NotFound(new { message = "Không tìm thấy thông tin trang" });
                return Ok(new { message = "Xóa thông tin trang thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
        [HttpGet("detail/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetDetailAsync(int id)
        {
            var result = await _webInfoService.GetDetailAsync(id);
            if (result == null) return NotFound(new { message = "Không tìm thấy thông tin trang" });
            return Ok(result);
        }
    }
}
