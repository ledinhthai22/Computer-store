using System.Threading.Tasks;
using Backend.DTO.WishList;

namespace Backend.Services.WishList
{
    public interface IWishListService
    {
        Task<List<WishlistResult>> GetByUserIdAsync(int userId);
        Task<WishlistResult> CreateAsync(CreateWishListRequest request);
        Task<bool> DeleteAsync(int yeuThichId);
     
    }
}