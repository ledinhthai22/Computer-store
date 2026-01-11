using Backend.DTO.Brand;
using Backend.Services.Brand;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/brands")]
    [Authorize(Policy = "AdminOnly")]
    public class BrandAdminController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandAdminController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        // GET /api/admin/brands
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _brandService.GetAllAsync();
            return Ok(result);
        }

        // GET /api/admin/brands/deleted
        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _brandService.GetAllHidenAsync();
            return Ok(result);
        }

        // GET /api/admin/brands/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _brandService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy thương hiệu" });

            return Ok(result);
        }

        // POST /api/admin/brands
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBrandRequest request)
        {
            var result = await _brandService.CreateAsync(request);
            return Ok(new
            {
                message = "Thêm thương hiệu thành công",
                data = result
            });
        }

        // PUT /api/admin/brands/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateBrandRequest request)
        {
            var result = await _brandService.UpdateAsync(id, request);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy thương hiệu" });

            return Ok(new
            {
                message = "Cập nhật thương hiệu thành công",
                data = result
            });
        }

        // DELETE /api/admin/brands/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var success = await _brandService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = "Không tìm thấy thương hiệu" });

            return Ok(new { message = "Xóa thương hiệu thành công" });
        }

        // PUT /api/admin/brands/recover/{id}
        [HttpPut("recover/{id:int}")]
        public async Task<IActionResult> Restore(int id)
        {
            var success = await _brandService.RestoreAsync(id);
            if (!success)
                return NotFound(new { message = "Không tìm thấy thương hiệu" });

            return Ok(new { message = "Khôi phục thương hiệu thành công" });
        }
    }
}
