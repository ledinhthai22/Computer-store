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
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _dbContext;
        public CartService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<CartReuslt>> GetByUserIdAsync(int UserId)
        {
            return await _dbContext.ChiTietGioHang
                .Where(c => c.MaNguoiDung == UserId)
                .Select(c => new CartReuslt { 
                    UserId = c.MaNguoiDung,
                    VariantId = c.MaBienThe,
                    VariantName = c.BienThe.SanPham.TenSanPham,
                    Price = c.BienThe.GiaBan.ToString(),
                    ImageUrl = c.BienThe.HinhAnhSanPham
                        .Where(i => i.AnhChinh)
                        .Select(img => img.URL)
                        .FirstOrDefault(),
                    DiscountPrice = c.BienThe.GiaKhuyenMai.ToString(),
                    Quantity = c.SoLuong
                })
                .ToListAsync();
        }
        public async Task<CartReuslt> CreateAsync(CartItemRequest request)
        {
            bool userExists = await _dbContext.NguoiDung
                .AnyAsync(u => u.MaNguoiDung == request.UserId);
            if (!userExists)
            {
                throw new KeyNotFoundException("Người dùng không tồn tại!");
            }
            var variantInfo = await _dbContext.BienThe
                .Where(bt => bt.MaBTSP == request.VariantId)
                .Select(bt => new
                {
                    bt.MaBTSP,
                    bt.GiaBan,
                    bt.GiaKhuyenMai,
                    TenSanPham = bt.SanPham.TenSanPham, 
                    HinhAnh = bt.HinhAnhSanPham      
                                .Where(i => i.AnhChinh)
                                .Select(i => i.URL)
                                .FirstOrDefault()
                })
                .FirstOrDefaultAsync();
            if (variantInfo == null)
            {
                throw new InvalidOperationException("Sản phẩm không tồn tại!");
            }
            bool existsInCart = await _dbContext.ChiTietGioHang
                .AnyAsync(c => c.MaNguoiDung == request.UserId && c.MaBienThe == request.VariantId);

            if (existsInCart)
            {
                throw new InvalidOperationException("Sản phẩm đã có trong giỏ hàng.");
            }
            var cartItem = new ChiTietGioHang
            {
                MaNguoiDung = request.UserId,
                MaBienThe = request.VariantId,
                SoLuong = request.Quantity
            };

            _dbContext.ChiTietGioHang.Add(cartItem);
            await _dbContext.SaveChangesAsync();

            
            return new CartReuslt
            {
                UserId = request.UserId,
                VariantId = variantInfo.MaBTSP,
                VariantName = variantInfo.TenSanPham,
                Price = variantInfo.GiaBan.ToString(),         
                DiscountPrice = variantInfo.GiaKhuyenMai.ToString(),
                ImageUrl = variantInfo.HinhAnh,
                Quantity = request.Quantity
            };
        }
        public async Task<CartReuslt> UpdateAsync(CartItemRequest request)
        {
            bool userExists = await _dbContext.NguoiDung
                .AnyAsync(u => u.MaNguoiDung == request.UserId);
            if (!userExists)
            {
                throw new KeyNotFoundException("Người dùng không tồn tại!");
            }
            var variantInfo = await _dbContext.BienThe
                .Where(bt => bt.MaBTSP == request.VariantId)
                .Select(bt => new
                {
                    bt.MaBTSP,
                    bt.GiaBan,
                    bt.GiaKhuyenMai,
                    TenSanPham = bt.SanPham.TenSanPham,
                    HinhAnh = bt.HinhAnhSanPham
                                .Where(i => i.AnhChinh)
                                .Select(i => i.URL)
                                .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (variantInfo == null)
            {
                throw new KeyNotFoundException("Sản phẩm không tồn tại!");
            }
            var cartItem = await _dbContext.ChiTietGioHang
                .FirstOrDefaultAsync(c => c.MaNguoiDung == request.UserId && c.MaBienThe == request.VariantId);

            if (cartItem == null)
            {
                throw new InvalidOperationException("Sản phẩm này chưa có trong giỏ hàng để cập nhật!");
            }
            if (request.Quantity == 0)
            {
                throw new InvalidOperationException("Số lượng sản phẩm phải > 0!");
            }
            cartItem.SoLuong = request.Quantity; 
            await _dbContext.SaveChangesAsync();
            return new CartReuslt
            {
                UserId = request.UserId,
                VariantId = request.VariantId,
                Quantity = cartItem.SoLuong, 
                VariantName = variantInfo.TenSanPham,
                Price = variantInfo.GiaBan.ToString(),
                DiscountPrice = variantInfo.GiaKhuyenMai.ToString(),
                ImageUrl = variantInfo.HinhAnh
            };
        }
        public async Task<bool> DeleteAsync(DeleteCartRequest request)
        {
            return await _dbContext.ChiTietGioHang
                .Where(c => c.MaNguoiDung == request.UserId && c.MaBienThe == request.VariantId)
                .ExecuteDeleteAsync() > 0;
        }

    }
}
