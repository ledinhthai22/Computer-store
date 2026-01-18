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
        public async Task<IActionResult> GetByCategory(int maDanhMuc, [FromQuery] int soLuong = 12)
        {
            var products = await _productService.GetProductsByCategoryAsync(maDanhMuc, soLuong);
            return Ok(products);
        }


        [HttpGet("brand/{maThuongHieu:int}")]
        public async Task<IActionResult> GetByBrand(int maThuongHieu, [FromQuery] int soLuong = 12)
        {
            var products = await _productService.GetProductsByBrandAsync(maThuongHieu, soLuong);
            return Ok(products);
        }
        [HttpGet("{maSanPham}/related")]
        public async Task<IActionResult> GetRelatedProducts(int maSanPham,[FromQuery] int limit = 10)
        {
            
            var product = await _productService.GetByIdAsync(maSanPham);
            if (product == null)
                return NotFound("Sản phẩm không tồn tại");

            var relatedProducts = await _productService.GetRelatedProductsAsync(
                maSanPham,
                product.MaDanhMuc,
                product.MaThuongHieu,
                limit
            );

            return Ok(relatedProducts);
        }
    }
}