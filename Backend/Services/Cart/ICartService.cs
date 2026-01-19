using Backend.DTO.Cart;

namespace Backend.Services.Cart
{
    public interface ICartService
    {
        Task<List<CartResult>> GetByUserIdAsync(int UserId);
        Task<CartResult> CreateAsync(CartItemRequest request);
        Task<CartResult> UpdateAsync(CartItemRequest request);
        Task<bool> DeleteAsync(DeleteCartRequest request);
        //Task<int> ClearCartAsync(int userId); // Xóa toàn bộ giỏ hàng
    }
}