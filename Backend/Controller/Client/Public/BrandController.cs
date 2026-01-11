using Backend.Services.Brand;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Client.Public
{
    [ApiController]
    [Route("api/brands")]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        // GET /api/brands
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _brandService.GetAllAsync();
            return Ok(result);
        }

        // GET /api/brands/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _brandService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy thương hiệu" });

            return Ok(result);
        }
    }
}
