using System.Threading.Tasks;
using Backend.Data;
using Backend.DTO.WishList;
using Backend.Helper;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Services.WishList
{
    public interface IWishListService
    {
        Task<List<WishlistResult>> GetByUserIdAsync(int UserId);
        Task<WishlistResult> CreateAsync(CreateWishListRequest request);
        Task<bool> DeleteAsync(int WishListId);
    }
}
