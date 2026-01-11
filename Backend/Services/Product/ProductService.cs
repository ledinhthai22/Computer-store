using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Ecommerce.DTO.Common;
using Ecommerce.DTO.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Product
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly SlugHelper _SlugHelper;

        public ProductService(ApplicationDbContext DbContext, SlugHelper SlugHelper)
        {
            _DbContext = DbContext;
            _SlugHelper = SlugHelper;
        }

        public async Task<PagedResult<ProductResult>> GetProductByCategoryAsync(string slug, int page = 1, int pageSize = 12)
        {
            var query = _DbContext.SanPham.AsNoTracking()
                .Where(p => p.DanhMuc.Slug == slug && p.TrangThai == true && p.NgayXoa == null);

            int totalItems = await query.CountAsync();
            var items = await ApplyProductProjection(query.OrderByDescending(p => p.NgayTao))
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResult<ProductResult>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = items
            };
        }
        public async Task<PagedResult<ProductResult>> GetProductByBrandAsync(string tenDanhHieu, int page = 1, int pageSize = 12)
        {
            var query = _DbContext.SanPham.AsNoTracking()
                .Where(p => p.ThuongHieu.TenThuongHieu == tenDanhHieu && p.TrangThai == true && p.NgayXoa == null);

            int totalItems = await query.CountAsync();
            var items = await ApplyProductProjection(query.OrderByDescending(p => p.NgayTao))
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResult<ProductResult>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = items
            };
        }
        public async Task<PagedResult<ProductResult>> FilterBySpecificationAsync(ProductSpecificationFilterRequest request)
        {
            var query = _DbContext.SanPham.AsNoTracking().Where(p => p.TrangThai == true && p.NgayXoa == null);

            // Filter logic
            if (!string.IsNullOrWhiteSpace(request.DongChip))
                query = query.Where(p => EF.Functions.Like(p.ThongSoKyThuat.LoaiXuLyTrungTam, $"%{request.DongChip}%"));

            if (!string.IsNullOrWhiteSpace(request.DongCard))
                query = query.Where(p => EF.Functions.Like(p.ThongSoKyThuat.LoaiXuLyDoHoa, $"%{request.DongCard}%"));

            if (!string.IsNullOrWhiteSpace(request.KichThuocManHinh))
                query = query.Where(p => EF.Functions.Like(p.ThongSoKyThuat.KichThuocManHinh, $"%{request.KichThuocManHinh}%"));

            if (!string.IsNullOrWhiteSpace(request.Ram))
                query = query.Where(p => p.BienThe.Any(bt => EF.Functions.Like(bt.Ram, $"%{request.Ram}%")));

            if (request.GiaTu > 0)
                query = query.Where(p => p.BienThe.Any(bt => bt.GiaBan >= request.GiaTu));

            if (request.GiaDen > 0)
                query = query.Where(p => p.BienThe.Any(bt => bt.GiaBan <= request.GiaDen));

            int totalItems = await query.CountAsync();
            var items = await ApplyProductProjection(query.OrderByDescending(p => p.NgayTao))
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            return new PagedResult<ProductResult>
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)request.PageSize),
                Items = items
            };
        }
        public async Task<ProductResult?> CreateAsync(CreateProductRequest request)
        {

            if (string.IsNullOrWhiteSpace(request.TenSanPham)) throw new Exception("Tên không được trống");

            using var transaction = await _DbContext.Database.BeginTransactionAsync();
            try
            {
                var spec = new ThongSoKyThuat
                {
                    KichThuocManHinh = request.ThongSoKyThuat.KichThuocManHinh,
                    SoKheRam = request.ThongSoKyThuat.SoKheRam,
                    OCung = request.ThongSoKyThuat.OCung,
                    Pin = request.ThongSoKyThuat.Pin,
                    HeDieuHanh = request.ThongSoKyThuat.HeDieuHanh,
                    DoPhanGiaiManHinh = request.ThongSoKyThuat.DoPhanGiaiManHinh,
                    LoaiXuLyTrungTam = request.ThongSoKyThuat.LoaiXuLyTrungTam,
                    LoaiXuLyDoHoa = request.ThongSoKyThuat.LoaiXuLyDoHoa,
                    CongGiaoTiep = request.ThongSoKyThuat.CongGiaoTiep
                };
                _DbContext.ThongSoKyThuat.Add(spec);
                await _DbContext.SaveChangesAsync();

                var product = new SanPham
                {
                    TenSanPham = request.TenSanPham,
                    Slug = _SlugHelper.GenerateSlug(request.TenSanPham),
                    GiaCoBan = request.GiaCoBan,
                    KhuyenMai = request.KhuyenMai,
                    SoLuongTon = request.SoLuongTon,
                    MaDanhMuc = request.MaDanhMuc,
                    MaThuongHieu = request.MaThuongHieu,
                    MaThongSo = spec.MaThongSo,
                    TrangThai = true,
                    NgayTao = DateTime.Now
                };
                _DbContext.SanPham.Add(product);
                await _DbContext.SaveChangesAsync();

                foreach (var v in request.BienThe)
                {
                    var variant = new BienThe
                    {
                        TenBienThe = v.TenBienThe,
                        GiaBan = v.GiaBan,
                        GiaKhuyenMai = v.GiaKhuyenMai,
                        MauSac = v.MauSac,
                        Ram = v.Ram,
                        OCung = v.OCung,
                        BoXuLyDoHoa = v.BoXuLyDoHoa,
                        BoXuLyTrungTam = v.BoXuLyTrungTam,
                        SoLuongTon = v.SoLuongTon,
                        MaSanPham = product.MaSanPham,
                        TrangThai = true
                    };
                    _DbContext.BienThe.Add(variant);
                    await _DbContext.SaveChangesAsync();

                    for (int i = 0; i < v.HinhAnh.Count; i++)
                    {
                        _DbContext.HinhAnhSanPham.Add(new HinhAnhSanPham
                        {
                            DuongDanAnh = v.HinhAnh[i],
                            AnhChinh = (i == 0), 
                            ThuTuAnh = i,
                            MaBienThe = variant.MaBTSP
                        });
                    }
                }
                await _DbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(product.MaSanPham);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<PagedResult<ProductResult>> GetPagedAsync(int page, int pageSize)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            var query = _DbContext.SanPham
                .AsNoTracking()
                .Where(p => p.TrangThai == true && p.NgayXoa == null);

            var totalItems = await query.CountAsync();

            var items = await ApplyProductProjection(query)
                .OrderByDescending(p => p.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ProductResult>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                Items = items
            };
        }
        public async Task<IEnumerable<ProductResult>> GetAllAsync()
        {
            var query = _DbContext.SanPham
                .AsNoTracking()
                .Where(p => p.TrangThai == true && p.NgayXoa == null);

            return await ApplyProductProjection(query).ToListAsync();
        }
        public async Task<ProductResult?> GetByIdAsync(int id)
        {
            var query = _DbContext.SanPham.AsNoTracking().Where(p => p.MaSanPham == id && p.TrangThai == true && p.NgayXoa == null);
            return await ApplyProductProjection(query).FirstOrDefaultAsync();
        }
        private IQueryable<ProductResult> ApplyProductProjection(IQueryable<SanPham> query)
        {
            return query.Select(p => new ProductResult
            {
                MaSanPham = p.MaSanPham,
                TenSanPham = p.TenSanPham,
                Slug = p.Slug,
                GiaCoBan = p.GiaCoBan,
                KhuyenMai = p.KhuyenMai,
                SoLuongTon = p.SoLuongTon,
                NgayTao = p.NgayTao,
                TenDanhMuc = p.DanhMuc != null ? p.DanhMuc.TenDanhMuc : string.Empty,
                TenThuongHieu = p.ThuongHieu != null ? p.ThuongHieu.TenThuongHieu : string.Empty,
                ThongSoKyThuat = p.ThongSoKyThuat == null ? null : new ProductSpecificationsResult
                {
                    KichThuocManHinh = p.ThongSoKyThuat.KichThuocManHinh,
                    Pin = p.ThongSoKyThuat.Pin,
                    HeDieuHanh = p.ThongSoKyThuat.HeDieuHanh,
                    DoPhanGiaiManHinh = p.ThongSoKyThuat.DoPhanGiaiManHinh,
                    OCung = p.ThongSoKyThuat.OCung,
                    SoKheRam = p.ThongSoKyThuat.SoKheRam,
                    LoaiXuLyDoHoa = p.ThongSoKyThuat.LoaiXuLyDoHoa,
                    LoaiXuLyTrungTam = p.ThongSoKyThuat.LoaiXuLyTrungTam,
                    CongGiaoTiep = p.ThongSoKyThuat.CongGiaoTiep
                },
                BienThe = p.BienThe.Where(bt => bt.TrangThai == true).Select(bt => new ProductVariantResult
                {
                    MaBTSP = bt.MaBTSP,
                    TenBienThe = bt.TenBienThe,
                    GiaBan = bt.GiaBan,
                    GiaKhuyenMai = bt.GiaKhuyenMai,
                    SoLuongTon = bt.SoLuongTon,
                    MauSac = bt.MauSac,
                    Ram = bt.Ram,
                    OCung = bt.OCung,
                    BoXuLyDoHoa = bt.BoXuLyDoHoa,
                    BoXuLyTrungTam = bt.BoXuLyTrungTam,
                    HinhAnh = bt.HinhAnhSanPham.OrderBy(h => h.ThuTuAnh).Select(h => h.DuongDanAnh).ToList()
                }).ToList()
            });
        }
    }
}