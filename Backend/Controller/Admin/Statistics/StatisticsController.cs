using System.Security.Claims;
using Backend.DTO.Order;
using Backend.Services.Statistics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller.Admin.Statistics
{
    [ApiController]
    [Route("api/admin/statistics")]
    [Authorize(Roles = "QuanTriVien")]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;
        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }
        [HttpGet("sales-overview")]
        public async Task<IActionResult> GetSalesOverview()
        {
            var result = await _statisticsService.GetSalesOverview();
            return Ok(result);
        }
        [HttpGet("top-selling-products")]
        public async Task<IActionResult> GetTopSellingProducts([FromQuery] int top = 5)
        {
            var result = await _statisticsService.GetTopSellingProducts(top);
            return Ok(result);
        }
        [HttpGet("order-status-statistics")]
        public async Task<IActionResult> GetOrderStatusStatistics()
        {
            var result = await _statisticsService.GetOrderStatusStatistics();
            return Ok(result);
        }
    }
}
