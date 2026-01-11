using Backend.Services.WebInfo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.DTO.WebInfo;


namespace Ecommerce.Controller.Admin.WebInfo
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebInfoController: ControllerBase
    {
        private readonly IWebInfoService _webInfoService;
        public WebInfoController(IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _webInfoService.GetAsync();
            return Ok(result);
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
    }
}
