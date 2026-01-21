using Backend.DTO.Order;
namespace Backend.Services.Order
{
    public interface IOrderService
    {
        Task<List<OrderResult>> GetAllAsync();
        Task<List<OrderResult>> GetAllByStatusAsync(int status);
        Task<OrderResult> GetByMaDHAsync(int MaDH);
        Task<OrderResult> GetByMaDonAsync(string MaDon);
        Task<List<OrderResult>> GetOrderByPhoneAsync(string Phone);
        Task<bool> UpdateStatusAsync(int MaDH, UpdateOrderStatusRequest request);
        Task<OrderResult> CreateOrderAsync(CreateOrderInfoRequest request);
        Task<OrderResult> CreateOrderFromCartAsync(int UserId, CheckoutCartRequest request);
        Task<OrderResult> UpdateOrderInfoAsync(int MaDH, int MaND, UpdateOrderInfo request);
        // Theo dõi đơn hàng của user theo trạng thái
        Task<List<OrderResult>> GetUserOrdersByStatusAsync(int userId, int status);

        // Theo dõi đơn hàng theo số điện thoại người nhận
        Task<List<OrderResult>> GetUserOrdersByPhoneAsync(int userId, string phone);

        // Theo dõi đơn hàng theo mã đơn hàng
        Task<OrderResult> GetUserOrderByCodeAsync(int userId, string maDon);

        // Xem lịch sử các đơn hàng đã hủy
        Task<List<OrderResult>> GetCancelledOrdersAsync(int userId);

        // Xem lịch sử các đơn hàng đã hoàn thành
        Task<List<OrderResult>> GetCompletedOrdersAsync(int userId);
        //hủy đơn hàng khi admin chưa xác nhận
        Task<bool> CancelOrderByUserAsync(int userId, int maDH);
        Task<OrderResult> GetUserOrderDetailAsync(int userId, int maDH);
        Task<OrderResult> SoftDeleteOrderAsync(int MaDH);
        Task<List<OrderResult>> GetOrderHiden();
    }
}
