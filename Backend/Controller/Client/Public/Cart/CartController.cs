using Backend.DTO.Cart;
using Backend.Services.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Client.Public.Cart
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
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> GetByUserId(int UserId)
        {
            try
            {
                var result = await _cartService.GetByUserIdAsync(UserId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Create(CartItemRequest request)
        {
            try
            {
                var result = await _cartService.CreateAsync(request);
                return Ok(new
                {
                    message = "Thêm vào giỏ hàng thành công",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Update(CartItemRequest request)
        {
            try
            {
                var result = await _cartService.UpdateAsync(request);
                return Ok(new
                {
                    message = "Cập nhật giỏ hàng thành công",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
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
        [Authorize(Policy = "UserOnly")]
        public async Task<IActionResult> Delete(DeleteCartRequest request)
        {
            try
            {
                var result = await _cartService.DeleteAsync(request);
                if (!result)
                    return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ hàng!" });

                return Ok(new { message = "Xóa sản phẩm thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }
    }
}