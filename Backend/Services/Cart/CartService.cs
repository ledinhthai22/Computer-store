using Backend.Data;
using Backend.DTO.Cart;
using Backend.Helper;
using Backend.Models;
using Ecommerce.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Services.Cart
{
    //public class CartService : ICartService
    //{
    //    private readonly ApplicationDbContext _dbContext;
    //    public CartService(ApplicationDbContext dbContext)
    //    {
    //        _dbContext = dbContext;
    //    }
    //    public async Task<List<CartReuslt>> GetByUserIdAsync(int UserId)
    //    {
    //        return await _dbContext.ChiTietGioHang
    //            .Where(c => c.MaNguoiDung == UserId)
    //            .Include(c => c.BienThe)
    //                .ThenInclude(bt => bt.SanPham)
    //            .Select(c => new CartReuslt
    //            {
    //                MaNguoiDung = c.MaNguoiDung,
    //                MaBienThe = c.MaBienThe,
    //                TenSanPham = c.BienThe.SanPham.TenSanPham,
    //                GiaBan = c.BienThe.GiaBan.ToString(),
    //                DuongDanAnh = c.BienThe.HinhAnhSanPham
    //                    .Where(i => i.AnhChinh)
    //                    .Select(img => img.DuongDanAnh)
    //                    .FirstOrDefault(),
    //                GiaKhuyenMai = c.BienThe.GiaKhuyenMai.ToString(),
    //                SoLuong = c.SoLuong
    //            })
    //            .ToListAsync();
    //    }
    //    public async Task<CartReuslt> CreateAsync(CartItemRequest request)
    //    {
    //        bool userExists = await _dbContext.NguoiDung
    //            .AnyAsync(u => u.MaNguoiDung == request.MaNguoiDung);
    //        if (!userExists)
    //        {
    //            throw new KeyNotFoundException("Người dùng không tồn tại!");
    //        }
    //        var variantInfo = await _dbContext.BienThe
    //            .Where(bt => bt.MaBTSP == request.MaBienThe)
    //            .Select(bt => new
    //            {
    //                bt.MaBTSP,
    //                bt.GiaBan,
    //                bt.GiaKhuyenMai,
    //                TenSanPham = bt.SanPham.TenSanPham,
    //                HinhAnh = bt.HinhAnhSanPham
    //                            .Where(i => i.AnhChinh)
    //                            .Select(i => i.DuongDanAnh)
    //                            .FirstOrDefault()
    //            })
    //            .FirstOrDefaultAsync();
    //        if (variantInfo == null)
    //        {
    //            throw new InvalidOperationException("Sản phẩm không tồn tại!");
    //        }
    //        bool existsInCart = await _dbContext.ChiTietGioHang
    //            .AnyAsync(c => c.MaNguoiDung == request.MaNguoiDung && c.MaBienThe == request.MaBienThe);

    //        if (existsInCart)
    //        {
    //            throw new InvalidOperationException("Sản phẩm đã có trong giỏ hàng.");
    //        }
    //        var cartItem = new ChiTietGioHang
    //        {
    //            MaNguoiDung = request.MaNguoiDung,
    //            MaBienThe = request.MaBienThe,
    //            SoLuong = request.SoLuong
    //        };

    //        _dbContext.ChiTietGioHang.Add(cartItem);
    //        await _dbContext.SaveChangesAsync();


    //        return new CartReuslt
    //        {
    //            MaNguoiDung = request.MaNguoiDung,
    //            MaBienThe = variantInfo.MaBTSP,
    //            TenSanPham = variantInfo.TenSanPham,
    //            GiaBan = variantInfo.GiaBan.ToString(),
    //            GiaKhuyenMai = variantInfo.GiaKhuyenMai.ToString(),
    //            DuongDanAnh = variantInfo.HinhAnh,
    //            SoLuong = request.SoLuong
    //        };
    //    }
    //    public async Task<CartReuslt> UpdateAsync(CartItemRequest request)
    //    {
    //        bool userExists = await _dbContext.NguoiDung
    //            .AnyAsync(u => u.MaNguoiDung == request.MaNguoiDung);
    //        if (!userExists)
    //        {
    //            throw new KeyNotFoundException("Người dùng không tồn tại!");
    //        }
    //        var variantInfo = await _dbContext.BienThe
    //            .Where(bt => bt.MaBTSP == request.MaBienThe)
    //            .Select(bt => new
    //            {
    //                bt.MaBTSP,
    //                bt.GiaBan,
    //                bt.GiaKhuyenMai,
    //                TenSanPham = bt.SanPham.TenSanPham,
    //                HinhAnh = bt.HinhAnhSanPham
    //                            .Where(i => i.AnhChinh)
    //                            .Select(i => i.DuongDanAnh)
    //                            .FirstOrDefault()
    //            })
    //            .FirstOrDefaultAsync();

    //        if (variantInfo == null)
    //        {
    //            throw new KeyNotFoundException("Sản phẩm không tồn tại!");
    //        }
    //        var cartItem = await _dbContext.ChiTietGioHang
    //            .FirstOrDefaultAsync(c => c.MaNguoiDung == request.MaNguoiDung && c.MaBienThe == request.MaBienThe);

    //        if (cartItem == null)
    //        {
    //            throw new InvalidOperationException("Sản phẩm này chưa có trong giỏ hàng để cập nhật!");
    //        }
    //        if (request.SoLuong == 0)
    //        {
    //            throw new InvalidOperationException("Số lượng sản phẩm phải > 0!");
    //        }
    //        cartItem.SoLuong = request.SoLuong;
    //        await _dbContext.SaveChangesAsync();
    //        return new CartReuslt
    //        {
    //            MaNguoiDung = request.MaNguoiDung,
    //            MaBienThe = request.MaBienThe,
    //            SoLuong = cartItem.SoLuong,
    //            TenSanPham = variantInfo.TenSanPham,
    //            GiaBan = variantInfo.GiaBan.ToString(),
    //            GiaKhuyenMai = variantInfo.GiaKhuyenMai.ToString(),
    //            DuongDanAnh = variantInfo.HinhAnh
    //        };
    //    }
    //    public async Task<bool> DeleteAsync(DeleteCartRequest request)
    //    {
    //        return await _dbContext.ChiTietGioHang
    //            .Where(c => c.MaNguoiDung == request.MaNguoiDung && c.MaBienThe == request.MaBienThe)
    //            .ExecuteDeleteAsync() > 0;
    //    }
    //}
}
