using Backend.DTO.Order;
using Backend.DTO.Search;
using Backend.Services.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Ecommerce.Controller.Admin.Search
{
    [Route("api/Search")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }
        [HttpGet]
        public async Task<IActionResult> SearchProductAsync([FromQuery] SearchUserRequest request)
        {
            try
            {
                var result = await _searchService.SearchProductsUserAsync(request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("admin/search")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> SearchProductAdminAsync([FromQuery] SearchAdminRequest request)
        {
            try
            {
                var result = await _searchService.SearchProductsAdminAsync(request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
