using Backend.DTO.Order;
namespace Backend.Services.Order
{
    public interface IOrderService
    {
        Task<List<OrderResult>> GetAllAsync();
        Task<List<OrderResult>> GetAllByStatusAsync(int status);
        Task<OrderResult> GetByMaDHAsync(int MaDH);
        Task<OrderResult> GetByMaDonAsync(string MaDon);
        Task<OrderResult> GetOrderByPhoneAsync(string Phone);
        Task<bool> UpdateStatusAsync(int MaDH, UpdateOrderStatusRequest request);
        Task<OrderResult> CreateOrderAsync(CreateOrderInfoRequest request);
        Task<OrderResult> CreateOrderFromCartAsync(int UserId, CheckoutCartRequest request);
        Task<OrderResult> UpdateOrderInfoAsync(int MaDH, int MaND, UpdateOrderInfo request);
    }
}
