using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
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
                            URL = img,
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
                .Where(p => p.TrangThai == true && p.Delete_At == null)
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
                .Where(p => p.TrangThai == true && p.Delete_At == null)
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
                    HinhAnh = v.HinhAnhSanPham.Select(x => x.URL).ToList()
                }).ToList(),
                message = "Thêm sản phẩm thành công"
            };
        }

    }
}
