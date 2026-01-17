using Backend.DTO.Statistics;

namespace Backend.Services.Statistics
{
    public interface IStatisticsService
    {
        Task<SalesOverview> GetSalesOverview();
        Task<List<ProductSales>> GetTopSellingProducts(int top = 5);
        Task<List<OrderStatus>> GetOrderStatusStatistics();
    }
}
