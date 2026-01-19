using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.DTO.WishList;
using Backend.Services.WishList;
using System.Threading.Tasks;

namespace Ecommerce.Controller.Client.Public.WishList
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishListController : ControllerBase
    {
        private readonly IWishListService _wishListService;

        public WishListController(IWishListService wishListService)
        {
            _wishListService = wishListService;
        }

        [HttpGet("{userId}")]
        [Authorize(Policy = "UserOnly")]  // giả sử bạn có policy này
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var result = await _wishListService.GetByUserIdAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Create([FromBody] CreateWishListRequest request)
        {
            try
            {
                var result = await _wishListService.CreateAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{yeuThichId}")]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Delete(int yeuThichId)
        {
            try
            {
                var success = await _wishListService.DeleteAsync(yeuThichId);
                if (!success)
                    return NotFound(new { message = "Không tìm thấy hoặc đã xóa yêu thích!" });

                return Ok(new { message = "Xóa yêu thích thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}