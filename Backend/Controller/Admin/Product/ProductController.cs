using Backend.DTO.Product;
using Backend.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin/products")]
    // [Authorize(Roles = "QuanTriVien")]
    public class AdminProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var result = await _productService.GetAdminProductListAsync();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(product);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _productService.CreateAsync(request);

                if (result == null)
                    return BadRequest(new { message = "Không thể tạo sản phẩm" });

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = result.MaSanPham },
                    result
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _productService.UpdateAsync(id, request);

                if (result == null)
                    return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteAsync(id);

            if (!success)
                return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });

            return Ok(new { message = "Xóa sản phẩm thành công" });
        }
        
        [HttpPost("{id:int}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            var success = await _productService.RestoreAsync(id);

            if (!success)
                return NotFound(new { message = $"Không tìm thấy sản phẩm đã xóa với ID {id}" });

            return Ok(new { message = "Khôi phục sản phẩm thành công" });
        }
    }
}

