using Backend.DTO.Cart;
using Backend.DTO.WishList;
using Backend.Services.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Customer.Cart
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }
        [HttpGet("{UserId}")]
        public async Task<IActionResult> GetByUserId(int UserId)
        {
            var result = await _cartService.GetByUserIdAsync(UserId);
            if (result == null) return NotFound(new { message = "Không tìm thấy giỏ hàng!" });
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create(CartItemRequest request)
        {
            try
            {
                var result = await _cartService.CreateAsync(request);
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
        [HttpPut]
        public async Task<IActionResult> Update(CartItemRequest request)
        {
            try
            {
                var result = await _cartService.UpdateAsync(request);
                if (result == null) return NotFound(new { message = "Không tìm thấy giỏ hàng" });
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
        [HttpDelete]
        public async Task<IActionResult> Delete(DeleteCartRequest request)
        {
            try
            {
                var result = await _cartService.DeleteAsync(request);
                if (!result) return NotFound(new { message = "Không tìm thấy giỏ hàng!" });
                return Ok(new { message = "Xóa giỏ hàng thành công!" });
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
