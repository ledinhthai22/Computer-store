using Backend.Data;
using Backend.Helper;
using Backend.Models;
using Backend.DTO.WishList;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Ecommerce.Models;

namespace Backend.Services.WishList
{
    public class WishListService :IWishListService
    {
        private readonly ApplicationDbContext _dbContext;
        public WishListService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<WishlistResult>> GetByUserIdAsync(int UserId)
        {
            var result = await _dbContext.YeuThich
                .Where(w => w.MaNguoiDung == UserId && w.Deleted_At == null)
                .Select(w => new WishlistResult
                {
                    WishlistId = w.MaYeuThich,
                    UserId = w.MaNguoiDung,
                    ProductVariantID = w.MaBienThe,
                    ProductName = w.BienThe.SanPham.TenSanPham,
                    Price = w.BienThe.GiaBan,
                    HinhAnhChinh= w.BienThe.HinhAnhSanPham
                    .Where(i => i.AnhChinh)
                    .Select(img => img.URL)
                    .FirstOrDefault()
                })
                .ToListAsync();
            return result;
        }

        public async Task<WishlistResult> CreateAsync(CreateWishListRequest request)
        {
            var productInfo = await _dbContext.BienThe
                .Include(bt => bt.SanPham)
                .Include(bt => bt.HinhAnhSanPham)
                .FirstOrDefaultAsync(bt => bt.MaBTSP == request.ProductVariantID);
            if (productInfo == null) throw new Exception("Sản phẩm không tồn tại");
            int UserId = request.UserID;
            int ProductVariantId = request.ProductVariantID;
            var existingItem = await _dbContext.YeuThich
                .FirstOrDefaultAsync(w => w.MaBienThe == ProductVariantId && w.MaNguoiDung == UserId);
            int wishlistId = 0;
            if (existingItem == null)
            {
                var newItem = new YeuThich
                {
                    MaBienThe = ProductVariantId,
                    MaNguoiDung = UserId,
                    Deleted_At = null
                };
                _dbContext.YeuThich.Add(newItem);
                await _dbContext.SaveChangesAsync();
                wishlistId = newItem.MaYeuThich;
            }
            else
            {
                if (existingItem.Deleted_At != null)
                {
                    existingItem.Deleted_At = null; // Khôi phục
                    await _dbContext.SaveChangesAsync();
                }
                wishlistId = existingItem.MaYeuThich;
            }
            return new WishlistResult
            {
                WishlistId = wishlistId,
                UserId = UserId,
                ProductVariantID = productInfo.MaBTSP,

                // Lấy từ biến productInfo đã query chắc chắn ở trên
                ProductName = productInfo.SanPham.TenSanPham,
                Price = productInfo.GiaBan,
                HinhAnhChinh = productInfo.HinhAnhSanPham
                                .Where(i => i.AnhChinh)
                                .Select(i => i.URL)
                                .FirstOrDefault()
            };
        }
        public async Task<bool> DeleteAsync(int WishListId)
        {
            var WishList = await _dbContext.YeuThich.FindAsync(WishListId);
            if (WishList == null || WishList.Deleted_At != null) return false;
            WishList.Deleted_At = DateTime.Now;
            bool deleted = await _dbContext.SaveChangesAsync() > 0;
            if (!deleted)
            {
                throw new InvalidOperationException("Xóa thương hiệu thất bại!");
            }
            return true;
        }
    }
}
