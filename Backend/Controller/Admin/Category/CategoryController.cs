using Microsoft.AspNetCore.Mvc;
using Backend.Services.Category;
using Backend.DTO.Category;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controller.Category
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            if (result == null) return NotFound(new { message = "Không tìm thấy danh mục" });
            return Ok(result);
        }
        [HttpGet("deleted")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetDeteleListAll()
        {
            var result = await _categoryService.GetDeleteListAsync();
            return Ok(result);
        }
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create(CreateCategoryRequest request)
        {
            try
            {
                var result = await _categoryService.CreateAsync(request);
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
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(int id, UpdateCategoryRequest request)
        {
            try
            {
                var result = await _categoryService.UpdateAsync(id, request);
                if (result == null) return NotFound(new { message = "Không tìm thấy danh mục." });

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _categoryService.DeleteAsync(id);

                if (!success)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục để xóa." });
                }

                return Ok(new { message = "Xóa danh mục thành công." });
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
        [HttpPut("recover/{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Restore(int id)
        {
            try
            {
                bool result = await _categoryService.RecoverAsync(id);

                if (!result)
                    return NotFound(new { message = "Không tìm thấy danh mục." });

                return Ok(new
                {
                    success = true,
                    message = "Khôi phục danh mục thành công."
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { success = false, message = "Lỗi server." });
            }
        }
    }
}