using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Order;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize]
        [HttpGet("by-status/{status}")]
        public async Task<IActionResult> GetOrdersByStatus(int status)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var orders = await _orderService.GetUserOrdersByStatusAsync(userId, status);

                return Ok(new
                {
                    success = true,
                    message = $"Lấy danh sách đơn hàng trạng thái '{GetStatusName(status)}' thành công",
                    data = orders,
                    total = orders.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("by-phone/{phone}")]
        public async Task<IActionResult> GetOrdersByPhone(string phone)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var orders = await _orderService.GetUserOrdersByPhoneAsync(userId, phone);

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng theo số điện thoại thành công",
                    data = orders,
                    total = orders.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("by-code/{maDon}")]
        public async Task<IActionResult> GetOrderByCode(string maDon)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var order = await _orderService.GetUserOrderByCodeAsync(userId, maDon);

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin đơn hàng thành công",
                    data = order
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("cancelled")]
        public async Task<IActionResult> GetCancelledOrders()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var orders = await _orderService.GetCancelledOrdersAsync(userId);

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng đã hủy thành công",
                    data = orders,
                    total = orders.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("completed")]
        public async Task<IActionResult> GetCompletedOrders()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var orders = await _orderService.GetCompletedOrdersAsync(userId);

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách đơn hàng đã hoàn thành thành công",
                    data = orders,
                    total = orders.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        private string GetStatusName(int status)
        {
            return status switch
            {
                0 => "Chờ duyệt",
                1 => "Đã duyệt",
                2 => "Đang xử lý",
                3 => "Đang giao",
                4 => "Đã giao",
                5 => "Hoàn thành",
                6 => "Đã hủy",
                7 => "Trả hàng",
                _ => "Không xác định"
            };
        }
    }
}