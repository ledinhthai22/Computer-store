// ===================================
// ProductService.cs
// ===================================
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Backend.Services.File;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Product
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _db;
        private readonly SlugHelper _slugHelper;
        private readonly IFileService _fileService;

        public ProductService(
            ApplicationDbContext db,
            SlugHelper slugHelper,
            IFileService fileService)
        {
            _db = db;
            _slugHelper = slugHelper;
            _fileService = fileService;
        }

        public async Task<ProductResult?> GetByIdAsync(int id)
        {
            var product = await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x => x.MaSanPham == id);

            if (product == null)
                return null;

            return MapToProductResult(product);
        }

        public async Task<ProductListResponse> GetAdminProductListAsync(AdminProductFilterRequest filter)
        {
            var query = _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .AsQueryable();

            // Lọc đã xóa
            if (!filter.BaoGomDaXoa)
            {
                query = query.Where(x => x.NgayXoa == null);
            }

            // Lọc theo từ khóa
            if (!string.IsNullOrEmpty(filter.TuKhoa))
            {
                var keyword = filter.TuKhoa.ToLower();
                query = query.Where(x =>
                    x.TenSanPham.ToLower().Contains(keyword) ||
                    x.Slug.ToLower().Contains(keyword)
                );
            }

            // Lọc theo danh mục
            if (filter.MaDanhMuc.HasValue)
            {
                query = query.Where(x => x.MaDanhMuc == filter.MaDanhMuc.Value);
            }

            // Lọc theo thương hiệu
            if (filter.MaThuongHieu.HasValue)
            {
                query = query.Where(x => x.MaThuongHieu == filter.MaThuongHieu.Value);
            }

            // Lọc theo trạng thái
            if (filter.TrangThai.HasValue)
            {
                query = query.Where(x => x.TrangThai == filter.TrangThai.Value);
            }

            // Sắp xếp
            query = filter.SapXep?.ToLower() switch
            {
                "ten-a-z" => query.OrderBy(x => x.TenSanPham),
                "ten-z-a" => query.OrderByDescending(x => x.TenSanPham),
                "ban-chay" => query.OrderByDescending(x => x.LuotMua),
                "moi-nhat" or _ => query.OrderByDescending(x => x.NgayTao)
            };

            var tongSo = await query.CountAsync();

            var danhSach = await query
                .Skip((filter.TrangHienTai - 1) * filter.SoLuongMoiTrang)
                .Take(filter.SoLuongMoiTrang)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();

            return new ProductListResponse
            {
                DanhSach = danhSach,
                TongSoSanPham = tongSo,
                TongSoTrang = (int)Math.Ceiling(tongSo / (double)filter.SoLuongMoiTrang),
                TrangHienTai = filter.TrangHienTai,
                SoLuongMoiTrang = filter.SoLuongMoiTrang
            };
        }

        public async Task<ProductResult?> CreateAsync(CreateProductRequest request)
        {
            // Validate trùng tên
            var existingProduct = await _db.SanPham
                .FirstOrDefaultAsync(x =>
                    x.TenSanPham.ToLower() == request.TenSanPham.ToLower() &&
                    x.NgayXoa == null);

            if (existingProduct != null)
                throw new Exception($"Sản phẩm '{request.TenSanPham}' đã tồn tại");

            var product = new SanPham
            {
                TenSanPham = request.TenSanPham,
                Slug = _slugHelper.GenerateSlug(request.TenSanPham),
                MaDanhMuc = request.MaDanhMuc,
                MaThuongHieu = request.MaThuongHieu,
                NgayTao = DateTime.UtcNow,
                TrangThai = true
            };

            // Thêm biến thể
            foreach (var bt in request.BienThe)
            {
                product.BienThe.Add(new BienThe
                {
                    TenBienThe = bt.TenBienThe,
                    GiaBan = bt.GiaBan,
                    GiaKhuyenMai = bt.GiaKhuyenMai,
                    MauSac = bt.MauSac,
                    Ram = bt.Ram,
                    OCung = bt.OCung,
                    BoXuLyTrungTam = bt.BoXuLyTrungTam,
                    BoXuLyDoHoa = bt.BoXuLyDoHoa,
                    SoLuongTon = bt.SoLuongTon,
                    TrangThai = true,
                    NgayXoa = null,

                    thongSoKyThuat = new ThongSoKyThuat
                    {
                        KichThuocManHinh = bt.ThongSoKyThuat.KichThuocManHinh ?? string.Empty,
                        SoKheRam = bt.ThongSoKyThuat.SoKheRam ?? string.Empty,
                        OCung = bt.ThongSoKyThuat.OCung ?? string.Empty,
                        Pin = bt.ThongSoKyThuat.Pin ?? string.Empty,
                        HeDieuHanh = bt.ThongSoKyThuat.HeDieuHanh ?? string.Empty,
                        DoPhanGiaiManHinh = bt.ThongSoKyThuat.DoPhanGiaiManHinh ?? string.Empty,
                        LoaiXuLyTrungTam = bt.ThongSoKyThuat.LoaiXuLyTrungTam ?? string.Empty,
                        LoaiXuLyDoHoa = bt.ThongSoKyThuat.LoaiXuLyDoHoa ?? string.Empty,
                        CongGiaoTiep = bt.ThongSoKyThuat.CongGiaoTiep ?? string.Empty
                    }
                });
            }

            // Upload hình ảnh
            if (request.HinhAnh != null && request.HinhAnh.Any())
            {
                int stt = 1;

                var firstVariantName = product.BienThe
                    .Select(x => x.TenBienThe)
                    .FirstOrDefault() ?? "default";

                foreach (var file in request.HinhAnh)
                {
                    var isAnhChinh = stt == 1;

                    var url = await _fileService.UploadProductImageAsync(
                        file,
                        product.TenSanPham,
                        firstVariantName,
                        isAnhChinh,
                        stt
                    );

                    product.HinhAnhSanPham.Add(new HinhAnhSanPham
                    {
                        DuongDanAnh = url,
                        AnhChinh = isAnhChinh,
                        ThuTuAnh = stt,
                        NgayXoa = null
                    });

                    stt++;
                }
            }

            _db.SanPham.Add(product);
            await _db.SaveChangesAsync();

            return await GetByIdAsync(product.MaSanPham);
        }

        public async Task<ProductResult?> UpdateAsync(int id, UpdateProductRequest request)
        {
            var product = await _db.SanPham
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x => x.MaSanPham == id && x.NgayXoa == null);

            if (product == null)
                return null;

            // Validate trùng tên
            if (!string.IsNullOrEmpty(request.TenSanPham) &&
                request.TenSanPham.ToLower() != product.TenSanPham.ToLower())
            {
                var existingProduct = await _db.SanPham
                    .FirstOrDefaultAsync(x =>
                        x.TenSanPham.ToLower() == request.TenSanPham.ToLower() &&
                        x.NgayXoa == null &&
                        x.MaSanPham != id);

                if (existingProduct != null)
                    throw new Exception($"Sản phẩm '{request.TenSanPham}' đã tồn tại");

                product.TenSanPham = request.TenSanPham;
                product.Slug = _slugHelper.GenerateSlug(request.TenSanPham);
            }

            // Cập nhật thông tin cơ bản
            if (request.MaDanhMuc.HasValue)
                product.MaDanhMuc = request.MaDanhMuc.Value;

            if (request.MaThuongHieu.HasValue)
                product.MaThuongHieu = request.MaThuongHieu.Value;

            // Xóa hình ảnh cũ
            if (request.HinhAnhXoa != null && request.HinhAnhXoa.Any())
            {
                var imagesToDelete = product.HinhAnhSanPham
                    .Where(x => request.HinhAnhXoa.Contains(x.MaHinhAnh))
                    .ToList();

                foreach (var img in imagesToDelete)
                {
                    await _fileService.DeleteAsync(img.DuongDanAnh);
                    _db.HinhAnhSanPham.Remove(img);
                }
            }

            // Thêm hình ảnh mới
            if (request.HinhAnhMoi != null && request.HinhAnhMoi.Any())
            {
                var maxStt = product.HinhAnhSanPham
                    .Where(x => x.NgayXoa == null)
                    .Select(x => x.ThuTuAnh)
                    .DefaultIfEmpty(0)
                    .Max();

                int stt = maxStt + 1;

                var firstVariantName = product.BienThe
                    .Where(x => x.NgayXoa == null)
                    .Select(x => x.TenBienThe)
                    .FirstOrDefault() ?? "default";

                foreach (var file in request.HinhAnhMoi)
                {
                    var isAnhChinh = !product.HinhAnhSanPham.Any(x => x.AnhChinh && x.NgayXoa == null);

                    var url = await _fileService.UploadProductImageAsync(
                        file,
                        product.TenSanPham,
                        firstVariantName,
                        isAnhChinh,
                        stt
                    );

                    product.HinhAnhSanPham.Add(new HinhAnhSanPham
                    {
                        DuongDanAnh = url,
                        AnhChinh = isAnhChinh,
                        ThuTuAnh = stt,
                        NgayXoa = null
                    });

                    stt++;
                }
            }

            // Xóa mềm biến thể
            if (request.BienTheXoa != null && request.BienTheXoa.Any())
            {
                var now = DateTime.UtcNow;

                var variantsToDelete = product.BienThe
                    .Where(x => request.BienTheXoa.Contains(x.MaBTSP))
                    .ToList();

                foreach (var bt in variantsToDelete)
                {
                    bt.NgayXoa = now;
                    bt.TrangThai = false;

                    if (bt.thongSoKyThuat != null)
                    {
                        _db.ThongSoKyThuat.Remove(bt.thongSoKyThuat);
                    }
                }
            }

            // Cập nhật/Thêm biến thể
            if (request.BienThe != null && request.BienThe.Any())
            {
                foreach (var btRequest in request.BienThe)
                {
                    if (btRequest.MaBTSP.HasValue)
                    {
                        // Cập nhật
                        var existingBt = product.BienThe
                            .FirstOrDefault(x =>
                                x.MaBTSP == btRequest.MaBTSP.Value &&
                                x.NgayXoa == null
                            );

                        if (existingBt != null)
                        {
                            existingBt.TenBienThe = btRequest.TenBienThe;
                            existingBt.GiaBan = btRequest.GiaBan;
                            existingBt.GiaKhuyenMai = btRequest.GiaKhuyenMai;
                            existingBt.MauSac = btRequest.MauSac;
                            existingBt.Ram = btRequest.Ram;
                            existingBt.OCung = btRequest.OCung;
                            existingBt.BoXuLyTrungTam = btRequest.BoXuLyTrungTam;
                            existingBt.BoXuLyDoHoa = btRequest.BoXuLyDoHoa;
                            existingBt.SoLuongTon = btRequest.SoLuongTon;

                            if (btRequest.TrangThai.HasValue)
                                existingBt.TrangThai = btRequest.TrangThai.Value;

                            if (existingBt.thongSoKyThuat != null)
                            {
                                existingBt.thongSoKyThuat.KichThuocManHinh = btRequest.ThongSoKyThuat.KichThuocManHinh;
                                existingBt.thongSoKyThuat.SoKheRam = btRequest.ThongSoKyThuat.SoKheRam;
                                existingBt.thongSoKyThuat.OCung = btRequest.ThongSoKyThuat.OCung;
                                existingBt.thongSoKyThuat.Pin = btRequest.ThongSoKyThuat.Pin;
                                existingBt.thongSoKyThuat.HeDieuHanh = btRequest.ThongSoKyThuat.HeDieuHanh;
                                existingBt.thongSoKyThuat.DoPhanGiaiManHinh = btRequest.ThongSoKyThuat.DoPhanGiaiManHinh;
                                existingBt.thongSoKyThuat.LoaiXuLyTrungTam = btRequest.ThongSoKyThuat.LoaiXuLyTrungTam;
                                existingBt.thongSoKyThuat.LoaiXuLyDoHoa = btRequest.ThongSoKyThuat.LoaiXuLyDoHoa;
                                existingBt.thongSoKyThuat.CongGiaoTiep = btRequest.ThongSoKyThuat.CongGiaoTiep;
                            }
                        }
                    }
                    else
                    {
                        // Thêm mới
                        product.BienThe.Add(new BienThe
                        {
                            TenBienThe = btRequest.TenBienThe,
                            GiaBan = btRequest.GiaBan,
                            GiaKhuyenMai = btRequest.GiaKhuyenMai,
                            MauSac = btRequest.MauSac,
                            Ram = btRequest.Ram,
                            OCung = btRequest.OCung,
                            BoXuLyTrungTam = btRequest.BoXuLyTrungTam,
                            BoXuLyDoHoa = btRequest.BoXuLyDoHoa,
                            SoLuongTon = btRequest.SoLuongTon,
                            TrangThai = btRequest.TrangThai ?? true,
                            NgayXoa = null,

                            thongSoKyThuat = new ThongSoKyThuat
                            {
                                KichThuocManHinh = btRequest.ThongSoKyThuat.KichThuocManHinh,
                                SoKheRam = btRequest.ThongSoKyThuat.SoKheRam,
                                OCung = btRequest.ThongSoKyThuat.OCung,
                                Pin = btRequest.ThongSoKyThuat.Pin,
                                HeDieuHanh = btRequest.ThongSoKyThuat.HeDieuHanh,
                                DoPhanGiaiManHinh = btRequest.ThongSoKyThuat.DoPhanGiaiManHinh,
                                LoaiXuLyTrungTam = btRequest.ThongSoKyThuat.LoaiXuLyTrungTam,
                                LoaiXuLyDoHoa = btRequest.ThongSoKyThuat.LoaiXuLyDoHoa,
                                CongGiaoTiep = btRequest.ThongSoKyThuat.CongGiaoTiep
                            }
                        });
                    }
                }
            }

            await _db.SaveChangesAsync();
            return await GetByIdAsync(id);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _db.SanPham
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x => x.MaSanPham == id && x.NgayXoa == null);

            if (product == null)
                return false;

            var now = DateTime.UtcNow;

            product.NgayXoa = now;
            product.TrangThai = false;

            // Xóa mềm hình ảnh và xóa file
            foreach (var img in product.HinhAnhSanPham.Where(x => x.NgayXoa == null))
            {
                img.NgayXoa = now;
                await _fileService.DeleteAsync(img.DuongDanAnh);
            }

            // Xóa mềm biến thể
            foreach (var bt in product.BienThe.Where(x => x.NgayXoa == null))
            {
                bt.NgayXoa = now;
                bt.TrangThai = false;

                if (bt.thongSoKyThuat != null)
                {
                    _db.ThongSoKyThuat.Remove(bt.thongSoKyThuat);
                }
            }

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RestoreAsync(int id)
        {
            var product = await _db.SanPham
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .FirstOrDefaultAsync(x => x.MaSanPham == id && x.NgayXoa != null);

            if (product == null)
                return false;

            product.NgayXoa = null;
            product.TrangThai = true;

            // Khôi phục hình ảnh
            foreach (var img in product.HinhAnhSanPham.Where(x => x.NgayXoa != null))
            {
                img.NgayXoa = null;
            }

            // Khôi phục biến thể
            foreach (var bt in product.BienThe.Where(x => x.NgayXoa != null))
            {
                bt.NgayXoa = null;
                bt.TrangThai = true;
            }

            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<ProductResult?> GetByIdForUserAsync(int id)
        {
            var product = await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x =>
                    x.MaSanPham == id &&
                    x.NgayXoa == null &&
                    x.TrangThai == true
                );

            if (product == null)
                return null;

            // Tăng lượt xem
            product.LuotXem++;
            await _db.SaveChangesAsync();

            return MapToProductResult(product);
        }

        public async Task<ProductResult?> GetBySlugAsync(string slug)
        {
            var product = await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x =>
                    x.Slug == slug &&
                    x.NgayXoa == null &&
                    x.TrangThai == true
                );

            if (product == null)
                return null;

            product.LuotXem++;
            await _db.SaveChangesAsync();

            return MapToProductResult(product);
        }

        public async Task<ProductListResponse> GetProductListAsync(ProductFilterRequest filter)
        {
            var query = _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x => x.NgayXoa == null && x.TrangThai == true)
                .AsQueryable();

            // Lọc theo từ khóa
            if (!string.IsNullOrEmpty(filter.TuKhoa))
            {
                var keyword = filter.TuKhoa.ToLower();
                query = query.Where(x =>
                    x.TenSanPham.ToLower().Contains(keyword) ||
                    x.DanhMuc!.TenDanhMuc.ToLower().Contains(keyword) ||
                    x.ThuongHieu!.TenThuongHieu.ToLower().Contains(keyword)
                );
            }

            // Lọc theo danh mục
            if (filter.MaDanhMuc.HasValue)
            {
                query = query.Where(x => x.MaDanhMuc == filter.MaDanhMuc.Value);
            }

            // Lọc theo thương hiệu
            if (filter.MaThuongHieu.HasValue)
            {
                query = query.Where(x => x.MaThuongHieu == filter.MaThuongHieu.Value);
            }

            // Lọc theo giá
            if (filter.GiaMin.HasValue || filter.GiaMax.HasValue)
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    (!filter.GiaMin.HasValue || bt.GiaBan >= filter.GiaMin.Value) &&
                    (!filter.GiaMax.HasValue || bt.GiaBan <= filter.GiaMax.Value)
                ));
            }

            // Lọc theo RAM
            if (!string.IsNullOrEmpty(filter.Ram))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null && bt.Ram.ToLower().Contains(filter.Ram.ToLower())
                ));
            }

            // Lọc theo ổ cứng
            if (!string.IsNullOrEmpty(filter.OCung))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null && bt.OCung.ToLower().Contains(filter.OCung.ToLower())
                ));
            }

            // Lọc theo màu sắc
            if (!string.IsNullOrEmpty(filter.MauSac))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null && bt.MauSac.ToLower().Contains(filter.MauSac.ToLower())
                ));
            }

            // Lọc theo CPU
            if (!string.IsNullOrEmpty(filter.BoXuLyTrungTam))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    bt.BoXuLyTrungTam.ToLower().Contains(filter.BoXuLyTrungTam.ToLower())
                ));
            }

            // Lọc theo GPU
            if (!string.IsNullOrEmpty(filter.BoXuLyDoHoa))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    bt.BoXuLyDoHoa.ToLower().Contains(filter.BoXuLyDoHoa.ToLower())
                ));
            }

            // Lọc theo kích thước màn hình
            if (!string.IsNullOrEmpty(filter.KichThuocManHinh))
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    bt.thongSoKyThuat != null &&
                    bt.thongSoKyThuat.KichThuocManHinh != null &&
                    bt.thongSoKyThuat.KichThuocManHinh.ToLower().Contains(filter.KichThuocManHinh.ToLower())
                ));
            }

            // Sắp xếp
            query = filter.SapXep?.ToLower() switch
            {
                "ban-chay" => query.OrderByDescending(x => x.LuotMua),
                "gia-thap" => query.OrderBy(x => x.BienThe
                    .Where(bt => bt.NgayXoa == null)
                    .Min(bt => bt.GiaBan)),
                "gia-cao" => query.OrderByDescending(x => x.BienThe
                    .Where(bt => bt.NgayXoa == null)
                    .Max(bt => bt.GiaBan)),
                "danh-gia" => query.OrderByDescending(x => x.DanhGiaTrungBinh),
                "moi-nhat" or _ => query.OrderByDescending(x => x.NgayTao)
            };

            var tongSo = await query.CountAsync();

            var danhSach = await query
                .Skip((filter.TrangHienTai - 1) * filter.SoLuongMoiTrang)
                .Take(filter.SoLuongMoiTrang)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();

            return new ProductListResponse
            {
                DanhSach = danhSach,
                TongSoSanPham = tongSo,
                TongSoTrang = (int)Math.Ceiling(tongSo / (double)filter.SoLuongMoiTrang),
                TrangHienTai = filter.TrangHienTai,
                SoLuongMoiTrang = filter.SoLuongMoiTrang
            };
        }

        public async Task<List<ProductListItem>> GetBestSellingProductsAsync(int soLuong = 10)
        {
            return await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x => x.NgayXoa == null && x.TrangThai == true)
                .OrderByDescending(x => x.LuotMua)
                .Take(soLuong)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();
        }

        public async Task<List<ProductListItem>> GetNewestProductsAsync(int soLuong = 10)
        {
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);

            return await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai == true &&
                    x.NgayTao >= oneMonthAgo
                )
                .OrderByDescending(x => x.NgayTao)
                .Take(soLuong)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();
        }

        public async Task<List<ProductListItem>> GetProductsByCategoryAsync(int maDanhMuc, int soLuong = 12)
        {
            return await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai == true &&
                    x.MaDanhMuc == maDanhMuc
                )
                .OrderByDescending(x => x.NgayTao)
                .Take(soLuong)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();
        }
        public async Task<List<ProductListItem>> GetProductsByBrandAsync(int maThuongHieu, int soLuong = 12)
        {
            return await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai == true &&
                    x.MaThuongHieu == maThuongHieu
                )
                .OrderByDescending(x => x.NgayTao)
                .Take(soLuong)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();
        }

        private static ProductResult MapToProductResult(SanPham sp)
        {
            return new ProductResult
            {
                MaSanPham = sp.MaSanPham,
                TenSanPham = sp.TenSanPham,
                Slug = sp.Slug,
                TenDanhMuc = sp.DanhMuc?.TenDanhMuc ?? "",
                TenThuongHieu = sp.ThuongHieu?.TenThuongHieu ?? "",
                NgayTao = sp.NgayTao,
                NgayXoa = sp.NgayXoa,
                TrangThai = sp.TrangThai,
                DanhGiaTrungBinh = sp.DanhGiaTrungBinh,
                LuotXem = sp.LuotXem,
                LuotMua = sp.LuotMua,

                HinhAnh = sp.HinhAnhSanPham
                    .Where(x => x.NgayXoa == null)
                    .OrderBy(x => x.ThuTuAnh)
                    .Select(x => x.DuongDanAnh)
                    .ToList(),

                BienThe = sp.BienThe
                    .Where(bt => bt.NgayXoa == null)
                    .Select(bt => new ProductVariantResult
                    {
                        MaBTSP = bt.MaBTSP,
                        TenBienThe = bt.TenBienThe,
                        GiaBan = bt.GiaBan,
                        GiaKhuyenMai = bt.GiaKhuyenMai,
                        MauSac = bt.MauSac,
                        Ram = bt.Ram,
                        OCung = bt.OCung,
                        BoXuLyTrungTam = bt.BoXuLyTrungTam,
                        BoXuLyDoHoa = bt.BoXuLyDoHoa,
                        SoLuongTon = bt.SoLuongTon,
                        TrangThai = bt.TrangThai,

                        ThongSoKyThuat = bt.thongSoKyThuat != null ? new ProductSpecificationsResult
                        {
                            KichThuocManHinh = bt.thongSoKyThuat.KichThuocManHinh,
                            SoKheRam = bt.thongSoKyThuat.SoKheRam,
                            OCung = bt.thongSoKyThuat.OCung,
                            Pin = bt.thongSoKyThuat.Pin,
                            HeDieuHanh = bt.thongSoKyThuat.HeDieuHanh,
                            DoPhanGiaiManHinh = bt.thongSoKyThuat.DoPhanGiaiManHinh,
                            LoaiXuLyTrungTam = bt.thongSoKyThuat.LoaiXuLyTrungTam,
                            LoaiXuLyDoHoa = bt.thongSoKyThuat.LoaiXuLyDoHoa,
                            CongGiaoTiep = bt.thongSoKyThuat.CongGiaoTiep
                        } : null
                    })
                    .ToList()
            };
        }

        private static ProductListItem MapToProductListItem(SanPham sp)
        {
            var bienTheActive = sp.BienThe.Where(bt => bt.NgayXoa == null).ToList();

            var giaMin = bienTheActive.Any() ? bienTheActive.Min(bt => bt.GiaBan) : 0;
            var giaMax = bienTheActive.Any() ? bienTheActive.Max(bt => bt.GiaBan) : 0;
            var giaKMMin = bienTheActive
                .Where(bt => bt.GiaKhuyenMai > 0)
                .Select(bt => bt.GiaKhuyenMai)
                .DefaultIfEmpty(0)
                .Min();

            return new ProductListItem
            {
                MaSanPham = sp.MaSanPham,
                TenSanPham = sp.TenSanPham,
                Slug = sp.Slug,
                TenDanhMuc = sp.DanhMuc?.TenDanhMuc ?? "",
                TenThuongHieu = sp.ThuongHieu?.TenThuongHieu ?? "",
                AnhDaiDien = sp.HinhAnhSanPham
                    .Where(x => x.NgayXoa == null && x.AnhChinh)
                    .Select(x => x.DuongDanAnh)
                    .FirstOrDefault(),
                GiaNhoNhat = giaMin,
                GiaLonNhat = giaMax,
                GiaKhuyenMaiNhoNhat = giaKMMin > 0 ? giaKMMin : null,
                DanhGiaTrungBinh = sp.DanhGiaTrungBinh,
                LuotXem = sp.LuotXem,
                LuotMua = sp.LuotMua,
                NgayTao = sp.NgayTao,
                SoLuongBienThe = bienTheActive.Count,
                CoKhuyenMai = bienTheActive.Any(bt => bt.GiaKhuyenMai > 0)
            };
        }
    }
}