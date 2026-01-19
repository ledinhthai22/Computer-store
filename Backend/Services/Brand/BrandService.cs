using Backend.Data;
using Backend.DTO.Brand;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Ecommerce.DTO.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.Extensions.Configuration;
namespace Backend.Services.Brand
{
    public class BrandService : IBrandService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _config;           
        public BrandService(ApplicationDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
        }
        public async Task<IEnumerable<BrandResult>> GetAllAsync()
        {
            return await _dbContext.ThuongHieu
                .Where(x => x.NgayXoa == null)
                .Select(b => new BrandResult
                {
                    MaThuongHieu = b.MaThuongHieu,
                    TenThuongHieu = b.TenThuongHieu,
                    NgayXoa = b.NgayXoa
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<BrandResult>> GetAllHidenAsync()
        {
            return await _dbContext.ThuongHieu
                .Where(x => x.NgayXoa != null)
                .Select(b => new BrandResult
                {
                    MaThuongHieu = b.MaThuongHieu,
                    TenThuongHieu = b.TenThuongHieu,
                    NgayXoa = b.NgayXoa
                })
                .ToListAsync();
        }
        public async Task<BrandResult?> GetByIdAsync(int id)
        {
            return await _dbContext.ThuongHieu
                .Where(b => b.MaThuongHieu == id && b.NgayXoa == null)
                .Select(b => new BrandResult
                {
                    MaThuongHieu = b.MaThuongHieu,
                    TenThuongHieu = b.TenThuongHieu,
                    NgayXoa = b.NgayXoa
                })
                .FirstOrDefaultAsync();
        }
        public async Task<BrandResult> CreateAsync(CreateBrandRequest request)
        {
            string BrandName = request.TenThuongHieu.Trim();

            bool isDuplicate = await _dbContext.ThuongHieu.AnyAsync(x => x.TenThuongHieu == BrandName && x.NgayXoa == null);
            if (isDuplicate)
            {
                throw new InvalidOperationException($"Thương hiệu '{BrandName}' đã tồn tại!");
            }
            var BrandNew = new ThuongHieu { TenThuongHieu = BrandName, NgayXoa = null };
            _dbContext.ThuongHieu.Add(BrandNew);
            bool created = await _dbContext.SaveChangesAsync() > 0;
            if (!created)
            {
                throw new InvalidOperationException("Tạo thương hiệu thất bại!");
            }
            return new BrandResult
            {
                MaThuongHieu = BrandNew.MaThuongHieu,
                TenThuongHieu = BrandNew.TenThuongHieu,
                NgayXoa = BrandNew.NgayXoa
            };
        }
        public async Task<BrandResult?> UpdateAsync(int id, UpdateBrandRequest request)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null) return null;
            string BrandName = request.BrandName.Trim();

            bool isDuplicate = await _dbContext.ThuongHieu
                .AnyAsync(x => x.TenThuongHieu == BrandName && x.MaThuongHieu != id && x.NgayXoa == null);
            if (isDuplicate)
            {
                throw new InvalidOperationException($"Thương hiệu '{BrandName}' đã tồn tại!");
            }
            brand.TenThuongHieu = BrandName;
            await _dbContext.SaveChangesAsync();
            return new BrandResult
            {
                MaThuongHieu = brand.MaThuongHieu,
                TenThuongHieu = brand.TenThuongHieu,
                NgayXoa = brand.NgayXoa
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null) return false;
            brand.NgayXoa = DateTime.Now;
            bool deleted = await _dbContext.SaveChangesAsync() > 0;
            if (!deleted)
            {
                throw new InvalidOperationException("Xóa thương hiệu thất bại!");
            }
            return true;
        }
        public async Task<bool> RestoreAsync(int id)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null)
            {
                return false;
            }
            if (brand.NgayXoa == null)
            {
                return true;
            }
            brand.NgayXoa = null;
            bool restored = await _dbContext.SaveChangesAsync() > 0;
            if (!restored)
            {
                throw new InvalidOperationException("Khôi phục thương hiệu thất bại!");
            }
            return true;
        }
        public async Task<List<ProductResult>> GetProductByBrand(int MaBrand)
        {
            return await _dbContext.SanPham
                .Where(s => s.MaThuongHieu == MaBrand && s.NgayXoa == null)
                .Select(p => new ProductResult
                {
                    MaSanPham = p.MaSanPham,
                    TenSanPham = p.TenSanPham,
                    Slug = p.Slug,
                    MaDanhMuc = p.MaDanhMuc,
                    TenDanhMuc = p.DanhMuc != null ? p.DanhMuc.TenDanhMuc : "",
                    MaThuongHieu = p.MaThuongHieu,
                    TenThuongHieu = p.ThuongHieu != null ? p.ThuongHieu.TenThuongHieu : "",

                    SoLuongTon = p.BienThe.Where(bt => bt.NgayXoa == null).Sum(bt => bt.SoLuongTon),

                    HinhAnh = p.HinhAnhSanPham
                        .Where(img => img.NgayXoa == null)
                        .OrderBy(img => img.ThuTuAnh)
                        .Select(img => new ProductImageResult
                        {
                            MaHinhAnh = img.MaHinhAnh,
                            DuongDan = $"{_config["AppSettings:BaseUrl"]}/product/image/{img.DuongDanAnh}",
                            AnhChinh = img.AnhChinh,
                            ThuTuAnh = img.ThuTuAnh
                        })
                        .ToList(),

                    BienThe = p.BienThe
                        .Where(bt => bt.NgayXoa == null)
                        .Select(bt => new ProductVariantResult
                        {
                            MaBTSP = bt.MaBTSP,
                            TenBienThe = bt.TenBienThe,
                            MauSac = bt.MauSac,
                            Ram = bt.Ram,
                            OCung = bt.OCung,
                            BoXuLyTrungTam = bt.BoXuLyTrungTam,
                            BoXuLyDoHoa = bt.BoXuLyDoHoa,
                            SoLuongTon = bt.SoLuongTon,
                            GiaBan = bt.GiaBan,
                            GiaKhuyenMai = bt.GiaKhuyenMai ?? 0,
                            TrangThai = bt.TrangThai,
                        }).ToList(),

                    TrangThai = p.TrangThai,
                    NgayTao = p.NgayTao,
                    LuotXem = p.LuotXem,
                    LuotMua = p.LuotMua,
                    DanhGiaTrungBinh = 0
                })
                .ToListAsync();
        }
    }
}

