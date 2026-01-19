using Backend.Data;
using Backend.DTO.Cart;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Cart
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _dbContext;

        public CartService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CartResult>> GetByUserIdAsync(int userId)
        {
            // Kiểm tra user tồn tại
            if (!await _dbContext.NguoiDung.AnyAsync(u => u.MaNguoiDung == userId))
                throw new KeyNotFoundException("Người dùng không tồn tại.");

            return await _dbContext.ChiTietGioHang
                .AsNoTracking()
                .Where(c => c.MaNguoiDung == userId)
                .Include(c => c.BienThe)
                    .ThenInclude(bt => bt.SanPham)
                        .ThenInclude(sp => sp.HinhAnhSanPham)
                .Where(c => c.BienThe.TrangThai && c.BienThe.SanPham.TrangThai) // Chỉ lấy sản phẩm còn hoạt động
                .Select(c => new CartResult
                {
                    MaNguoiDung = c.MaNguoiDung,
                    MaBienThe = c.MaBienThe,
                    TenSanPham = c.BienThe.SanPham.TenSanPham,
                    GiaBan = c.BienThe.GiaBan.ToString("N0"),
                    GiaKhuyenMai = c.BienThe.GiaKhuyenMai.HasValue
                                         ? c.BienThe.GiaKhuyenMai.Value.ToString("N0")
                                         : string.Empty,
                    DuongDanAnh = c.BienThe.SanPham.HinhAnhSanPham
                                         .Where(i => i.AnhChinh)
                                         .Select(i => i.DuongDanAnh)
                                         .FirstOrDefault() ?? "/images/default-product.jpg",
                    SoLuong = c.SoLuong,
                    SoLuongTon = c.BienThe.SoLuongTon
                })
                .OrderByDescending(c => c.MaBienThe)
                .ToListAsync();
        }


        public async Task<CartResult> CreateAsync(CartItemRequest request)
        {
            // Validate input
            if (request.SoLuong <= 0)
                throw new InvalidOperationException("Số lượng phải lớn hơn 0.");

            // Kiểm tra user
            if (!await _dbContext.NguoiDung.AnyAsync(u => u.MaNguoiDung == request.MaNguoiDung))
                throw new KeyNotFoundException("Người dùng không tồn tại.");

            // Lấy thông tin variant và kiểm tra tồn kho
            var variantInfo = await _dbContext.BienThe
                .AsNoTracking()
                .Where(bt => bt.MaBTSP == request.MaBienThe && bt.TrangThai)
                .Select(bt => new
                {
                    bt.MaBTSP,
                    bt.GiaBan,
                    bt.GiaKhuyenMai,
                    bt.SoLuongTon,
                    TenSanPham = bt.SanPham.TenSanPham,
                    SanPhamTrangThai = bt.SanPham.TrangThai,
                    AnhChinh = bt.SanPham.HinhAnhSanPham
                                 .Where(i => i.AnhChinh)
                                 .Select(i => i.DuongDanAnh)
                                 .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (variantInfo == null || !variantInfo.SanPhamTrangThai)
                throw new KeyNotFoundException("Sản phẩm không tồn tại hoặc đã ngừng bán.");

            // Kiểm tra tồn kho
            if (request.SoLuong > variantInfo.SoLuongTon)
                throw new InvalidOperationException($"Sản phẩm chỉ còn {variantInfo.SoLuongTon} trong kho.");

            // Kiểm tra đã có trong giỏ chưa
            var existingItem = await _dbContext.ChiTietGioHang
                .FirstOrDefaultAsync(c => c.MaNguoiDung == request.MaNguoiDung
                                       && c.MaBienThe == request.MaBienThe);

            if (existingItem != null)
            {
                // Nếu đã có → cộng dồn số lượng
                int newQuantity = existingItem.SoLuong + request.SoLuong;
                if (newQuantity > variantInfo.SoLuongTon)
                    throw new InvalidOperationException($"Tổng số lượng vượt quá tồn kho ({variantInfo.SoLuongTon}).");

                existingItem.SoLuong = newQuantity;
                await _dbContext.SaveChangesAsync();

                return new CartResult
                {
                    MaNguoiDung = request.MaNguoiDung,
                    MaBienThe = variantInfo.MaBTSP,
                    TenSanPham = variantInfo.TenSanPham,
                    GiaBan = variantInfo.GiaBan.ToString("N0"),
                    GiaKhuyenMai = variantInfo.GiaKhuyenMai?.ToString("N0") ?? string.Empty,
                    DuongDanAnh = variantInfo.AnhChinh ?? "/images/default-product.jpg",
                    SoLuong = existingItem.SoLuong,
                    SoLuongTon = variantInfo.SoLuongTon
                };
            }

            // Thêm mới vào giỏ
            var newItem = new ChiTietGioHang
            {
                MaNguoiDung = request.MaNguoiDung,
                MaBienThe = request.MaBienThe,
                SoLuong = request.SoLuong
            };

            _dbContext.ChiTietGioHang.Add(newItem);
            await _dbContext.SaveChangesAsync();

            return new CartResult
            {
                MaNguoiDung = request.MaNguoiDung,
                MaBienThe = variantInfo.MaBTSP,
                TenSanPham = variantInfo.TenSanPham,
                GiaBan = variantInfo.GiaBan.ToString("N0"),
                GiaKhuyenMai = variantInfo.GiaKhuyenMai?.ToString("N0") ?? string.Empty,
                DuongDanAnh = variantInfo.AnhChinh ?? "/images/default-product.jpg",
                SoLuong = newItem.SoLuong,
                SoLuongTon = variantInfo.SoLuongTon
            };
        }

        public async Task<CartResult> UpdateAsync(CartItemRequest request)
        {
            if (request.SoLuong <= 0)
                throw new InvalidOperationException("Số lượng phải lớn hơn 0.");

            var cartItem = await _dbContext.ChiTietGioHang
                .Include(c => c.BienThe)
                    .ThenInclude(bt => bt.SanPham)
                        .ThenInclude(sp => sp.HinhAnhSanPham)
                .FirstOrDefaultAsync(c => c.MaNguoiDung == request.MaNguoiDung
                                       && c.MaBienThe == request.MaBienThe);

            if (cartItem == null)
                throw new KeyNotFoundException("Sản phẩm không có trong giỏ hàng.");

            // Kiểm tra sản phẩm còn hoạt động
            if (!cartItem.BienThe.TrangThai || !cartItem.BienThe.SanPham.TrangThai)
                throw new InvalidOperationException("Sản phẩm đã ngừng kinh doanh.");

            // Kiểm tra tồn kho
            if (request.SoLuong > cartItem.BienThe.SoLuongTon)
                throw new InvalidOperationException($"Sản phẩm chỉ còn {cartItem.BienThe.SoLuongTon} trong kho.");

            cartItem.SoLuong = request.SoLuong;
            await _dbContext.SaveChangesAsync();

            var anhChinh = cartItem.BienThe.SanPham.HinhAnhSanPham
                .FirstOrDefault(i => i.AnhChinh)?.DuongDanAnh
                ?? "/images/default-product.jpg";

            return new CartResult
            {
                MaNguoiDung = request.MaNguoiDung,
                MaBienThe = request.MaBienThe,
                TenSanPham = cartItem.BienThe.SanPham.TenSanPham,
                GiaBan = cartItem.BienThe.GiaBan.ToString("N0"),
                GiaKhuyenMai = cartItem.BienThe.GiaKhuyenMai?.ToString("N0") ?? string.Empty,
                DuongDanAnh = anhChinh,
                SoLuong = cartItem.SoLuong,
                SoLuongTon = cartItem.BienThe.SoLuongTon
            };
        }

        public async Task<bool> DeleteAsync(DeleteCartRequest request)
        {
            return await _dbContext.ChiTietGioHang
                .Where(c => c.MaNguoiDung == request.MaNguoiDung
                         && c.MaBienThe == request.MaBienThe)
                .ExecuteDeleteAsync() > 0;
        }

    }
}