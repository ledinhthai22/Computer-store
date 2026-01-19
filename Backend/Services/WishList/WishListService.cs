using Backend.Data;
using Backend.DTO.WishList;
using Backend.Models;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.WishList
{
    public class WishListService : IWishListService
    {
        private readonly ApplicationDbContext _dbContext;

        public WishListService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<WishlistResult>> GetByUserIdAsync(int userId)
        {
            var result = await _dbContext.YeuThich
                .Where(w => w.MaNguoiDung == userId && w.NgayXoa == null)
                .Include(w => w.SanPham)
                    .ThenInclude(sp => sp.HinhAnhSanPham)
                .Include(w => w.SanPham)
                    .ThenInclude(sp => sp.BienThe)   // ← thêm include biến thể để lấy giá
                .Select(w => new WishlistResult
                {
                    MaYeuThich = w.MaYeuThich,
                    MaNguoiDung = w.MaNguoiDung,
                    MaSanPham = w.MaSanPham,
                    TenSanPham = w.SanPham.TenSanPham,

                    HinhAnhChinh = w.SanPham.HinhAnhSanPham
                        .Where(i => i.AnhChinh && i.NgayXoa == null)
                        .OrderBy(i => i.ThuTuAnh)
                        .Select(img => img.DuongDanAnh)
                        .FirstOrDefault() ?? "default-product.jpg",

                    // Tính giá thấp nhất từ các biến thể còn hàng (TrangThai = true, SoLuongTon > 0)
                    GiaBan = w.SanPham.BienThe
                        .Where(bt => bt.TrangThai && bt.SoLuongTon > 0)
                        .Min(bt => (decimal?)bt.GiaBan),

                    GiaKhuyenMai = w.SanPham.BienThe
                        .Where(bt => bt.TrangThai && bt.SoLuongTon > 0 && bt.GiaKhuyenMai.HasValue)
                        .Min(bt => bt.GiaKhuyenMai),

                  
                })
                .ToListAsync();

            return result;
        }

        public async Task<WishlistResult> CreateAsync(CreateWishListRequest request)
        {
            var sanPham = await _dbContext.SanPham
                .Include(sp => sp.HinhAnhSanPham)
                .Include(sp => sp.BienThe)   
                .FirstOrDefaultAsync(sp => sp.MaSanPham == request.MaSanPham);

            if (sanPham == null)
                throw new Exception("Sản phẩm không tồn tại");

            var userId = request.MaNguoiDung;
            var maSanPham = request.MaSanPham;

            var existing = await _dbContext.YeuThich
                .FirstOrDefaultAsync(w => w.MaSanPham == maSanPham && w.MaNguoiDung == userId);

            int yeuThichId;

            if (existing == null)
            {
                var newItem = new YeuThich
                {
                    MaNguoiDung = userId,
                    MaSanPham = maSanPham,
                    NgayXoa = null
                };
                _dbContext.YeuThich.Add(newItem);
                await _dbContext.SaveChangesAsync();
                yeuThichId = newItem.MaYeuThich;
            }
            else
            {
                if (existing.NgayXoa != null)
                {
                    existing.NgayXoa = null;
                    // existing.NgayThem = DateTime.Now; // nếu có trường này
                    await _dbContext.SaveChangesAsync();
                }
                yeuThichId = existing.MaYeuThich;
            }

            return new WishlistResult
            {
                MaYeuThich = yeuThichId,
                MaNguoiDung = userId,
                MaSanPham = sanPham.MaSanPham,
                TenSanPham = sanPham.TenSanPham,

                HinhAnhChinh = sanPham.HinhAnhSanPham
                    .Where(i => i.AnhChinh && i.NgayXoa == null)
                    .OrderBy(i => i.ThuTuAnh)
                    .Select(i => i.DuongDanAnh)
                    .FirstOrDefault() ?? "default-product.jpg",

                    GiaBan = sanPham.BienThe
                    .Where(bt => bt.TrangThai && bt.SoLuongTon > 0)
                    .Min(bt => (decimal?)bt.GiaBan),

                GiaKhuyenMai = sanPham.BienThe
                    .Where(bt => bt.TrangThai && bt.SoLuongTon > 0 && bt.GiaKhuyenMai.HasValue)
                    .Min(bt => bt.GiaKhuyenMai),

            };
        }

        public async Task<bool> DeleteAsync(int yeuThichId)
        {
            var item = await _dbContext.YeuThich.FindAsync(yeuThichId);
            if (item == null || item.NgayXoa != null)
                return false;

            item.NgayXoa = DateTime.Now;
            var saved = await _dbContext.SaveChangesAsync() > 0;

            if (!saved)
                throw new InvalidOperationException("Xóa yêu thích thất bại!");

            return true;
        }
    }
}