using Backend.DTO.Product;
using Backend.Services.Product;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class UserProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public UserProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterRequest filter)
        {
            var result = await _productService.GetProductListAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdForUserAsync(id);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            return Ok(product);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _productService.GetBySlugAsync(slug);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            return Ok(product);
        }

        [HttpGet("best-selling")]
        public async Task<IActionResult> GetBestSelling([FromQuery] int soLuong = 10)
        {
            var products = await _productService.GetBestSellingProductsAsync(soLuong);
            return Ok(products);
        }

        [HttpGet("newest")]
        public async Task<IActionResult> GetNewest([FromQuery] int soLuong = 10)
        {
            var products = await _productService.GetNewestProductsAsync(soLuong);
            return Ok(products);
        }

        [HttpGet("category/{maDanhMuc:int}")]
        public async Task<IActionResult> GetByCategory(
            int maDanhMuc,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] int? maThuongHieu = null, 
            [FromQuery] decimal? giaMin = null,   
            [FromQuery] decimal? giaMax = null)    
        {
            var result = await _productService
                .GetProductsByCategoryPagingAsync(maDanhMuc, page, pageSize, maThuongHieu, giaMin, giaMax);
            return Ok(result);
        }

        [HttpGet("brand/{maThuongHieu:int}")]
        public async Task<IActionResult> GetByBrand(
            int maThuongHieu,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] int? maDanhMuc = null,      
            [FromQuery] decimal? giaMin = null,     
            [FromQuery] decimal? giaMax = null)    
        {
            var result = await _productService
                .GetProductsByBrandPagingAsync(maThuongHieu, page, pageSize, maDanhMuc, giaMin, giaMax);
            return Ok(result);
        }
    }
}