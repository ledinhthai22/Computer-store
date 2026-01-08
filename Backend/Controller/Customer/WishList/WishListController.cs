using Microsoft.AspNetCore.Mvc;
using Backend.Services.WishList;
using Microsoft.AspNetCore.Authorization;
using Backend.DTO.WishList;

namespace Ecommerce.Controller.Customer.WishList
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
        [HttpGet("{UserId}")]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> GetByUserId(int UserId)
        {
            var result = await _wishListService.GetByUserIdAsync(UserId);
            if (result == null) return NotFound(new { message = "Không tìm thấy yêu thích!" });
            return Ok(result);
        }
        [HttpPost]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Create(CreateWishListRequest request)
        {
            try
            {
                var result = await _wishListService.CreateAsync(request);
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
        [HttpDelete("{WishListId}")]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Delete(int WishListId)
        {
            try
            {
                var result = await _wishListService.DeleteAsync(WishListId);
                if (!result) return NotFound(new { message = "Không tìm thấy yêu thích!" });
                return Ok(new { message = "Xóa yêu thích thành công!" });
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
    }
}
