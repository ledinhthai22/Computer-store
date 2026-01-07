using Backend.DTO.Product;
using Backend.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller.Admin.Product
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _IProductService;

        public ProductController(IProductService IProductService)
        {
            _IProductService = IProductService;
        }


        [HttpPost("create")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> CreateAsync([FromBody] CreateProductRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ",
                    errors = ModelState.Values.SelectMany(x => x.Errors.Select(e => e.ErrorMessage))
                });
            }

            try
            {
                var result = await _IProductService.CreateAsync(request);
                return Ok(new
                {
                    message = "Thêm sản phẩm thành công",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var data = await _IProductService.GetAllAsync();
            return Ok(new
            {
                count = data.Count(),
                data = data
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var product = await _IProductService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            }
            return Ok(product);
        }
    }
}
