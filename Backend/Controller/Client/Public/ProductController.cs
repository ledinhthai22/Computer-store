using Backend.Services.Product;
using Ecommerce.DTO.Product;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Client.Public
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        //[HttpGet]
        //public async Task<IActionResult> GetProducts(
        //    [FromQuery] int page = 1,
        //    [FromQuery] int pageSize = 12)
        //{
        //    var result = await _productService.GetPagedAsync(page, pageSize);
        //    return Ok(result);
        //}

        //[HttpGet("category/{slug}")]
        //public async Task<IActionResult> GetByCategory(
        //    string slug,
        //    [FromQuery] int page = 1,
        //    [FromQuery] int pageSize = 12)
        //{
        //    var result = await _productService
        //        .GetProductByCategoryAsync(slug, page, pageSize);

        //    if (result.TotalItems == 0)
        //        return NotFound(new { message = "Không có sản phẩm cho danh mục này" });

        //    return Ok(result);
        //}

        //// GET /api/products/brand?name=apple&page=1&pageSize=12
        //[HttpGet("brand")]
        //public async Task<IActionResult> GetByBrand(
        //    [FromQuery] string name,
        //    [FromQuery] int page = 1,
        //    [FromQuery] int pageSize = 12)
        //{
        //    var result = await _productService
        //        .GetProductByBrandAsync(name, page, pageSize);

        //    return Ok(result);
        //}

        //// POST /api/products/filter/specification
        //[HttpPost("filter/specification")]
        //public async Task<IActionResult> FilterBySpecification(
        //    [FromBody] ProductSpecificationFilterRequest request)
        //{
        //    var result = await _productService.FilterBySpecificationAsync(request);
        //    return Ok(result);
        //}
        //// GET /api/products/{slug}
        //[HttpGet("{slug}")]
        //public async Task<IActionResult> GetDetail(string slug)
        //{
        //    var product = await _productService.GetByIdAsync(slug);

        //    if (product == null)
        //        return NotFound(new { message = "Không tìm thấy sản phẩm" });
        //    return Ok(product);
        //}
    }
}
