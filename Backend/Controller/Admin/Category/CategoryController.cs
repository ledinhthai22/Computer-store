using Backend.DTO.Category;
using Backend.Services.Category;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/categories")]
    [Authorize(Policy = "AdminOnly")]
    public class CategoryAdminController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryAdminController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET /api/admin/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAdminAsync();
            return Ok(result);
        }

        // GET /api/admin/categories/deleted
        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _categoryService.GetDeleteListAsync();
            return Ok(result);
        }

        // GET /api/admin/categories/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            return Ok(result);
        }

        // POST /api/admin/categories
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        {
            var result = await _categoryService.CreateAsync(request);
            return Ok(new
            {
                message = "Thêm danh mục thành công",
                data = result
            });
        }

        // PUT /api/admin/categories/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateCategoryRequest request)
        {
            var result = await _categoryService.UpdateAsync(id, request);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            return Ok(new
            {
                message = "Cập nhật danh mục thành công",
                data = result
            });
        }

        // DELETE /api/admin/categories/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            return Ok(new { message = "Xóa danh mục thành công" });
        }

        // PUT /api/admin/categories/recover/{id}
        [HttpPut("recover/{id:int}")]
        public async Task<IActionResult> Restore(int id)
        {
            var success = await _categoryService.RecoverAsync(id);
            if (!success)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            return Ok(new { message = "Khôi phục danh mục thành công" });
        }
    }
}
