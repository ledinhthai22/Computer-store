using Backend.DTO.Product;
using Backend.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/products")]
    [Authorize(Policy = "AdminOnly")]
    public class ProductAdminController : ControllerBase
    {
        private readonly IProductService _IProductService;

        public ProductAdminController(IProductService productService)
        {
            _IProductService = productService;
        }

        // GET /api/admin/products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _IProductService.GetAllAsync();
            return Ok(new
            {
                count = data.Count(),
                data
            });
        }

        // GET /api/admin/products/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _IProductService.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(product);
        }

        // POST /api/admin/products
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateProductRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ",
                    errors = ModelState.Values
                        .SelectMany(x => x.Errors.Select(e => e.ErrorMessage))
                });
            }

            var result = await _IProductService.CreateAsync(request);

            return Ok(new
            {
                message = "Thêm sản phẩm thành công",
                data = result
            });
        }

        //// PUT /api/admin/products/{id}
        //[HttpPut("{id:int}")]
        //public async Task<IActionResult> Update(int id, UpdateProductRequest request)
        //{
        //    var result = await _productService.UpdateAsync(id, request);
        //    return Ok(result);
        //}

        //// DELETE /api/admin/products/{id}
        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    await _productService.DeleteAsync(id);
        //    return Ok(new { message = "Xóa sản phẩm thành công" });
        //}
    }
}
