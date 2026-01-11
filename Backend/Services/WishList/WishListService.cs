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
                .Where(w => w.MaNguoiDung == UserId && w.NgayXoa == null)
                .Select(w => new WishlistResult
                {
                    MaYeuThich = w.MaYeuThich,
                    MaNguoiDung = w.MaNguoiDung,
                    MaBienThe = w.MaBienThe,
                    TenSanPham = w.BienThe.SanPham.TenSanPham,
                    GiaBan = w.BienThe.GiaBan,
                    HinhAnhChinh= w.BienThe.HinhAnhSanPham
                    .Where(i => i.AnhChinh)
                    .Select(img => img.DuongDanAnh)
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
                .FirstOrDefaultAsync(bt => bt.MaBTSP == request.MaBienThe);
            if (productInfo == null) throw new Exception("Sản phẩm không tồn tại");
            int UserId = request.MaNguoiDung;
            int ProductVariantId = request.MaBienThe;
            var existingItem = await _dbContext.YeuThich
                .FirstOrDefaultAsync(w => w.MaBienThe == ProductVariantId && w.MaNguoiDung == UserId);
            int wishlistId = 0;
            if (existingItem == null)
            {
                var newItem = new YeuThich
                {
                    MaBienThe = ProductVariantId,
                    MaNguoiDung = UserId,
                    NgayXoa = null
                };
                _dbContext.YeuThich.Add(newItem);
                await _dbContext.SaveChangesAsync();
                wishlistId = newItem.MaYeuThich;
            }
            else
            {
                if (existingItem.NgayXoa != null)
                {
                    existingItem.NgayXoa = null; // Khôi phục
                    await _dbContext.SaveChangesAsync();
                }
                wishlistId = existingItem.MaYeuThich;
            }
            return new WishlistResult
            {
                MaYeuThich = wishlistId,
                MaNguoiDung = UserId,
                MaBienThe = productInfo.MaBTSP,

                // Lấy từ biến productInfo đã query chắc chắn ở trên
                TenSanPham = productInfo.SanPham.TenSanPham,
                GiaBan = productInfo.GiaBan,
                HinhAnhChinh = productInfo.HinhAnhSanPham
                                .Where(i => i.AnhChinh)
                                .Select(i => i.DuongDanAnh)
                                .FirstOrDefault()
            };
        }
        public async Task<bool> DeleteAsync(int WishListId)
        {
            var WishList = await _dbContext.YeuThich.FindAsync(WishListId);
            if (WishList == null || WishList.NgayXoa != null) return false;
            WishList.NgayXoa = DateTime.Now;
            bool deleted = await _dbContext.SaveChangesAsync() > 0;
            if (!deleted)
            {
                throw new InvalidOperationException("Xóa thương hiệu thất bại!");
            }
            return true;
        }
    }
}
