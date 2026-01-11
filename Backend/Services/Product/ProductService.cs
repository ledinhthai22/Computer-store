using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Ecommerce.DTO.Common;
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
        public async Task<PagedResult<ProductResult>> GetProductByCategoryAsync(string slug,int page = 1,int pageSize = 12)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 12;

            var category = await _DbContext.DanhMuc
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Slug == slug &&
                    x.TrangThai == true &&
                    x.NgayXoa == null);

            if (category == null)
            {
                return new PagedResult<ProductResult>
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var query = _DbContext.SanPham
                .AsNoTracking()
                .Where(p =>
                    p.MaDanhMuc == category.MaDanhMuc &&
                    p.TrangThai == true &&
                    p.NgayXoa == null);

            var totalItems = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductResult
                {
                    MaSanPham = p.MaSanPham,
                    TenSanPham = p.TenSanPham,
                    Slug = p.Slug,
                    GiaCoBan = p.GiaCoBan,
                    KhuyenMai = p.KhuyenMai,
                    SoLuongTon = p.SoLuongTon,
                    NgayTao = p.NgayTao,

                    MaDanhMuc = category.MaDanhMuc,
                    TenDanhMuc = category.TenDanhMuc,

                    TenThuongHieu = p.ThuongHieu != null
                        ? p.ThuongHieu.TenThuongHieu
                        : string.Empty,

                    ThongSoKyThuat = p.ThongSoKyThuat == null
                        ? null!
                        : new ProductSpecificationsResult
                        {
                            KichThuocManHinh = p.ThongSoKyThuat.KichThuocManHinh,
                            Pin = p.ThongSoKyThuat.Pin,
                            HeDieuHanh = p.ThongSoKyThuat.HeDieuHanh,
                            DoPhanGiaiManHinh = p.ThongSoKyThuat.DoPhanGiaiManHinh,
                            OCung = p.ThongSoKyThuat.OCung,
                            SoKheRam = p.ThongSoKyThuat.SoKheRam,
                            LoaiXuLyDoHoa =p.ThongSoKyThuat.LoaiXuLyDoHoa,
                            LoaiXuLyTrungTam = p.ThongSoKyThuat.LoaiXuLyTrungTam,
                            CongGiaoTiep = p.ThongSoKyThuat.CongGiaoTiep
                        },

                         BienThe = p.BienThe
                        .Where(bt => bt.TrangThai == true)
                        .Select(bt => new ProductVariantResult
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

                            HinhAnh = bt.HinhAnhSanPham
                                .OrderBy(h => h.ThuTuAnh)
                                .Select(h => h.DuongDanAnh)
                                .ToList()
                        })
                        .ToList()
                })
                .ToListAsync();

            return new PagedResult<ProductResult>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = products
            };
        }

        public async Task<ProductResult?> CreateAsync(CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.TenSanPham))
            {
                throw new Exception("Tên sản phẩm không được để trống");
            }
            if (request.GiaCoBan <= 0)
            {
                throw new Exception("Giá cơ bản phải lớn hơn 0");
            }
            if (request.KhuyenMai < 0 || request.KhuyenMai > 100)
            {
                throw new Exception("Khuyến mãi chỉ được từ 0% đển 100%");
            }
            if (request.BienThe.Count == 0)
            {
                throw new Exception("1 phẩm phải có ít nhất 1 biến thể");
            }
            if (!await _DbContext.DanhMuc.AnyAsync(x => x.MaDanhMuc == request.MaDanhMuc))
            {
                throw new Exception("Danh mục không tồn tại");
            }
            if (!await _DbContext.ThuongHieu.AnyAsync(x => x.MaThuongHieu == request.MaThuongHieu))
            {
                throw new Exception("Thương hiệu không tồn tại");
            }
            using var transaction = await _DbContext.Database.BeginTransactionAsync();
            try
            {
                var productSpecification = new ThongSoKyThuat
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
                _DbContext.ThongSoKyThuat.Add(productSpecification);
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
                    MaThongSo = productSpecification.MaThongSo
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
                        MaSanPham = product.MaSanPham
                    };

                    _DbContext.BienThe.Add(variant);
                    await _DbContext.SaveChangesAsync();
                    int index = 0;
                    foreach (var img in v.HinhAnh)
                    {
                        _DbContext.HinhAnhSanPham.Add(new HinhAnhSanPham
                        {
                            DuongDanAnh = img,
                            AnhChinh = index == 1,
                            ThuTuAnh = index,
                            MaBienThe = variant.MaBTSP
                        });
                        index++;
                    }
                }

                await _DbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(product.MaSanPham);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        public async Task<IEnumerable<ProductResult>> GetAllAsync()
        {
            var data = await _DbContext.SanPham
                .Include(p => p.DanhMuc)
                .Include(p => p.ThuongHieu)
                .Include(p => p.ThongSoKyThuat)
                .Include(p => p.BienThe).ThenInclude(v => v.HinhAnhSanPham)
                .Where(p => p.TrangThai == true && p.NgayXoa == null)
                .ToListAsync(); 

            return data.Select(MapToResult).ToList();

        }

        public async Task<ProductResult?> GetByIdAsync(int id)
        {
            var p = await _DbContext.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.ThongSoKyThuat)
                .Include(x => x.BienThe).ThenInclude(b => b.HinhAnhSanPham)
                .Where(p => p.TrangThai == true && p.NgayXoa == null)
                .FirstOrDefaultAsync(x => x.MaSanPham == id);

            return p == null ? null : MapToResult(p);
        }

        private ProductResult MapToResult(SanPham p)
        {
            return new ProductResult
            {
                MaSanPham = p.MaSanPham,
                TenSanPham = p.TenSanPham,
                Slug = p.Slug,
                GiaCoBan = p.GiaCoBan,
                KhuyenMai = p.KhuyenMai,
                SoLuongTon = p.SoLuongTon,
                TenDanhMuc = p.DanhMuc?.TenDanhMuc ?? "",
                TenThuongHieu = p.ThuongHieu?.TenThuongHieu ?? "",
                NgayTao = p.NgayTao,
                
                ThongSoKyThuat = new ProductSpecificationsResult
                {
                    KichThuocManHinh = p.ThongSoKyThuat!.KichThuocManHinh,
                    SoKheRam = p.ThongSoKyThuat.SoKheRam,
                    OCung = p.ThongSoKyThuat.OCung,
                    Pin = p.ThongSoKyThuat.Pin,
                    HeDieuHanh = p.ThongSoKyThuat.HeDieuHanh,
                    DoPhanGiaiManHinh = p.ThongSoKyThuat.DoPhanGiaiManHinh,
                    LoaiXuLyDoHoa = p.ThongSoKyThuat.LoaiXuLyDoHoa,
                    LoaiXuLyTrungTam = p.ThongSoKyThuat.LoaiXuLyTrungTam,
                    CongGiaoTiep = p.ThongSoKyThuat.CongGiaoTiep
                },

                BienThe = p.BienThe.Select(v => new ProductVariantResult
                {
                    MaBTSP = v.MaBTSP,
                    TenBienThe = v.TenBienThe,
                    GiaBan = v.GiaBan,
                    GiaKhuyenMai = v.GiaKhuyenMai,
                    MauSac = v.MauSac,
                    Ram = v.Ram,
                    OCung = v.OCung,
                    BoXuLyDoHoa = v.BoXuLyDoHoa,
                    BoXuLyTrungTam = v.BoXuLyTrungTam,
                    SoLuongTon = v.SoLuongTon,
                    HinhAnh = v.HinhAnhSanPham.Select(x => x.DuongDanAnh).ToList()
                }).ToList(),
                message = "Thêm sản phẩm thành công"
            };
        }

    }
}
