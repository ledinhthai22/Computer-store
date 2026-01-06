using Microsoft.AspNetCore.Mvc;
using Backend.Services.Brand;
using Microsoft.AspNetCore.Authorization;
using Backend.DTO.Brand;

namespace Ecommerce.Controller.Admin.Brand
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;
        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _brandService.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _brandService.GetByIdAsync(id);
            if (result == null) return NotFound(new { message = "Không tìm thấy thương hiệu" });
            return Ok(result);
        }
        [HttpPost]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Create(CreateBrandRequest request)
        {
            try
            {
                var result = await _brandService.CreateAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> Update(int id, UpdateBrandRequest request)
        {
            try
            {
                var result = await _brandService.UpdateAsync(id, request);
                if (result == null) return NotFound(new { message = "Không tìm thấy thương hiệu" });
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> SolfDelete(int id)
        {
            try
            {
                var success = await _brandService.DeleteAsync(id);
                if (!success) return NotFound(new { message = "Không tìm thấy thương hiệu" });
                return Ok(new { message = "Xóa thương hiệu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}
