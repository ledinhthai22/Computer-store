using System.Security.Claims;
using Backend.DTO.Order;
using Backend.Services.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Controller.Admin.Order
{
    [ApiController]
    [Route("api/order")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost("Check-out-Cart/{MaKH}")]
        public async Task<IActionResult> CreateOrderFromCartAsync(int MaKH, [FromBody] CheckoutCartRequest request)
        {
            try
            {
                var result = await _orderService.CreateOrderFromCartAsync(MaKH, request);
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
        [HttpPut("Cap-nhat-thong-tin/{MaDH}")]
        public async Task<IActionResult> UpdateInfoAsync(int MaDH, [FromBody] UpdateOrderInfo request)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdString))
                {
                    return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong Token." });
                }
                int currentUserId = int.Parse(userIdString);
                var result = await _orderService.UpdateOrderInfoAsync(MaDH, currentUserId, request);
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
        [HttpPost("Tao-Don-Hang")]
        public async Task<IActionResult> CreateOrderAsync([FromBody] CreateOrderInfoRequest request)
        {
            try
            {
                var result = await _orderService.CreateOrderAsync(request);
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
        //[HttpGet("Ma-Don-Hang/{MaDH:int}")]
        //public async Task<IActionResult> GetByMaDHAsync(int MaDH)
        //{
        //    var order = await _orderService.GetByMaDHAsync(MaDH);
        //    if (order == null) return Ok(new { message = "Mã đơn hàng không tồn tại" });
        //    return Ok(order);
        //}
        [HttpGet("Ma-Don/{MaDon}")]
        public async Task<IActionResult> GetByMaDonAsync(string MaDon)
        {
            var order = await _orderService.GetByMaDonAsync(MaDon);
            if (order == null) return Ok(new { message = "Mã đơn không tồn tại" });
            return Ok(order);
        }

    }
}
