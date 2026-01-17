using System.Security.Claims;
using Backend.DTO.Order;
using Backend.Services.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Controller.Admin.Order
{
    [ApiController]
    [Route("api/admin/order")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _orderService.GetAllAsync());
        }
        [HttpGet("status/{status:int}")]
        public async Task<IActionResult> GetAllByStatusAsync(int status)
        {
            if (0 > status || status > 7) return Ok(new { message = "Nhập sai trạng thái đơn hàng" });
            return Ok( await _orderService.GetAllByStatusAsync(status));
        }
        [HttpGet("Ma-Don-Hang/{MaDH:int}")]
        public async Task<IActionResult> GetByMaDHAsync(int MaDH)
        {
            var order = await _orderService.GetByMaDHAsync(MaDH);
            if (order == null) return Ok(new { message = "Mã đơn hàng không tồn tại" });
            return Ok(order);
        }
        [HttpGet("Ma-Don/{MaDon}")]
        public async Task<IActionResult> GetByMaDonAsync(string MaDon)
        {
            var order = await _orderService.GetByMaDonAsync(MaDon);
            if (order == null) return Ok(new { message = "Mã đơn không tồn tại" });
            return Ok(order);
        }
        [HttpGet("So-Dien-Thoai/{Phone}")]
        public async Task<IActionResult> GetByPhoneAsync(string Phone)
        {
            var order = await _orderService.GetOrderByPhoneAsync(Phone);
            if (order == null) return Ok(new { message = "Số điện thoại không nhận hàng không tồn tại" });
            return Ok(order);
        }
        [HttpPut("{MaDH:int}")]
        public async Task<IActionResult> UpdateStatusAsync(int MaDH,UpdateOrderStatusRequest request)
        {
            try
            {
                var result = await _orderService.UpdateStatusAsync(MaDH, request);
                if(!result)return Ok(new { message = "Cập nhật trạng thái đơn hàng thất bại" });
                return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công!" });
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
        [HttpPost("Check-out-Cart/{MaKH}")]
        public async Task<IActionResult> CreateOrderFromCartAsync(int MaKH,[FromBody] CheckoutCartRequest request)
        {
            try
            {
                var result = await _orderService.CreateOrderFromCartAsync(MaKH,request);
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

    }
}
