using System.IO;
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Backend.Services.File;
using Ecommerce.DTO.Common;
using Ecommerce.DTO.Product;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using IOFile = System.IO.File;
namespace Backend.Services.Product
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _db;
        private readonly SlugHelper _slugHelper;
        private readonly IFileService _fileService;
        private readonly IConfiguration _config;
        private readonly ILogger<ProductService> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProductService(
            ApplicationDbContext db,
            SlugHelper slugHelper,
            IFileService fileService,
            IConfiguration config,
            ILogger<ProductService> logger,
            IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _slugHelper = slugHelper;
            _fileService = fileService;
            _config = config;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ProductResult?> GetByIdAsync(int id)
        {
            var product = await _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                    .ThenInclude(bt => bt.thongSoKyThuat)
                .FirstOrDefaultAsync(x => x.MaSanPham == id && x.NgayXoa == null);

            if (product == null) return null;

            return new ProductResult
            {
                MaSanPham = product.MaSanPham,
                TenSanPham = product.TenSanPham,
                Slug = product.Slug,
                MaDanhMuc = product.MaDanhMuc,
                TenDanhMuc = product.DanhMuc!.TenDanhMuc,
                MaThuongHieu = product.MaThuongHieu,
                TenThuongHieu = product.ThuongHieu!.TenThuongHieu,
                SoLuongTon = product.BienThe.Sum(bt => bt.SoLuongTon), // Tổng tồn kho từ các biến thể

                // List<ProductImageResult> thay vì List<string>
                HinhAnh = product.HinhAnhSanPham
                    .Where(img => img.NgayXoa == null) // Chỉ lấy ảnh chưa bị xóa
                    .OrderBy(img => img.ThuTuAnh)     // Sắp xếp theo thứ tự hiển thị
                    .Select(img => new ProductImageResult
                    {
                        MaHinhAnh = img.MaHinhAnh,
                        DuongDan = $"{_config["AppSettings:BaseUrl"]}/product/image/{img.DuongDanAnh}",
                        AnhChinh = img.AnhChinh,
                        ThuTuAnh = img.ThuTuAnh
                    })
                    .ToList(),

                BienThe = product.BienThe
                    .Where(bt => bt.NgayXoa == null) // Chỉ lấy biến thể chưa bị xóa
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
                        GiaKhuyenMai = bt.GiaKhuyenMai,
                        TrangThai = bt.TrangThai,

                        ThongSoKyThuat = bt.thongSoKyThuat == null ? null : new ProductSpecificationsResult
                        {
                            KichThuocManHinh = bt.thongSoKyThuat.KichThuocManHinh,
                            DungLuongRam = bt.thongSoKyThuat.DungLuongRam,
                            SoKheRam = bt.thongSoKyThuat.SoKheRam,
                            OCung = bt.thongSoKyThuat.OCung,
                            Pin = bt.thongSoKyThuat.Pin,
                            HeDieuHanh = bt.thongSoKyThuat.HeDieuHanh,
                            DoPhanGiaiManHinh = bt.thongSoKyThuat.DoPhanGiaiManHinh,
                            LoaiXuLyTrungTam = bt.thongSoKyThuat.LoaiXuLyTrungTam,
                            LoaiXuLyDoHoa = bt.thongSoKyThuat.LoaiXuLyDoHoa,
                            CongGiaoTiep = bt.thongSoKyThuat.CongGiaoTiep
                        }
                    }).ToList(),

                // Bổ sung các trường còn lại theo DTO ProductResult mới
                TrangThai = product.TrangThai,
                NgayTao = product.NgayTao,
                LuotXem = product.LuotXem,
                LuotMua = product.LuotMua,
                DanhGiaTrungBinh = 0 // Tính toán logic đánh giá nếu cần
            };
        }


        public async Task<List<AdminListProductItem>> GetAdminProductListAsync()
        {
            return await _db.SanPham
                .AsNoTracking()
                .Where(x => x.NgayXoa == null)
                .Select(x => new AdminListProductItem
                {
                    MaSanPham = x.MaSanPham,
                    TenSanPham = x.TenSanPham,
                    Slug = x.Slug,
                    TenDanhMuc = x.DanhMuc!.TenDanhMuc,
                    TenThuongHieu = x.ThuongHieu!.TenThuongHieu,
                    TongSoLuong = x.BienThe.Sum(bt => bt.SoLuongTon),
                    TrangThai = x.TrangThai,
                    NgayXoa = x.NgayXoa
                })
                .OrderByDescending(x => x.MaSanPham)
                .ToListAsync();
        }

        public async Task<ProductResult?> CreateAsync(CreateProductRequest request)
        {
            // 1. Validate cơ bản
            if (string.IsNullOrWhiteSpace(request.TenSanPham))
                throw new ArgumentException("Tên sản phẩm không được để trống");

            // Validate trùng tên
            var existingProduct = await _db.SanPham
                .AnyAsync(x => x.TenSanPham.Trim().ToLower() == request.TenSanPham.Trim().ToLower()
                            && x.NgayXoa == null);

            if (existingProduct)
                throw new InvalidOperationException($"Sản phẩm '{request.TenSanPham}' đã tồn tại");

            // Validate danh mục & thương hiệu
            if (!await _db.DanhMuc.AnyAsync(d => d.MaDanhMuc == request.MaDanhMuc && d.NgayXoa == null))
                throw new ArgumentException("Danh mục không tồn tại hoặc đã bị xóa");

            if (!await _db.ThuongHieu.AnyAsync(b => b.MaThuongHieu == request.MaThuongHieu && b.NgayXoa == null))
                throw new ArgumentException("Thương hiệu không tồn tại hoặc đã bị xóa");

            // Validate biến thể
            if (request.BienThe == null || !request.BienThe.Any())
                throw new ArgumentException("Sản phẩm phải có ít nhất một biến thể");

            // Validate hình ảnh
            if (request.HinhAnh == null || !request.HinhAnh.Any())
                throw new ArgumentException("Sản phẩm phải có ít nhất một hình ảnh");

            // Validate giá của từng biến thể
            foreach (var bt in request.BienThe)
            {
                if (bt.GiaBan <= 0)
                    throw new ArgumentException($"Giá bán của biến thể '{bt.TenBienThe}' phải lớn hơn 0");
                if (bt.GiaKhuyenMai >= bt.GiaBan)
                {
                    throw new ArgumentException(
                        $"Giá khuyến mãi của biến thể '{bt.TenBienThe}' phải nhỏ hơn giá bán"
                    );
                }

                if (bt.SoLuongTon < 0)
                    throw new ArgumentException($"Số lượng tồn của biến thể '{bt.TenBienThe}' không hợp lệ");
            }

            // 2. Tạo sản phẩm
            var tongSoLuongTon = request.BienThe.Sum(bt => bt.SoLuongTon);

            var product = new SanPham
            {
                TenSanPham = request.TenSanPham.Trim(),
                Slug = _slugHelper.GenerateSlug(request.TenSanPham),
                MaDanhMuc = request.MaDanhMuc,
                MaThuongHieu = request.MaThuongHieu,
                SoLuongTon = tongSoLuongTon,
                DanhGiaTrungBinh = 0,
                LuotXem = 0,
                LuotMua = 0,
                TrangThai = true,
                NgayTao = DateTime.UtcNow,
                NgayXoa = null
            };

            // 3. Thêm biến thể
            foreach (var btReq in request.BienThe)
            {
                var bienThe = new BienThe
                {
                    TenBienThe = btReq.TenBienThe?.Trim() ?? "Đang cập nhật",
                    GiaBan = btReq.GiaBan,
                    GiaKhuyenMai = btReq.GiaKhuyenMai,
                    MauSac = btReq.MauSac?.Trim() ?? "Đang cập nhật",
                    Ram = btReq.Ram?.Trim() ?? "Đang cập nhật",
                    OCung = btReq.OCung?.Trim() ?? "Đang cập nhật",
                    BoXuLyTrungTam = btReq.BoXuLyTrungTam?.Trim() ?? "Đang cập nhật",
                    BoXuLyDoHoa = btReq.BoXuLyDoHoa?.Trim() ?? "Đang cập nhật",
                    SoLuongTon = btReq.SoLuongTon,
                    TrangThai = true,
                    NgayXoa = null
                };

                // Thêm thông số kỹ thuật
                bienThe.thongSoKyThuat = btReq.ThongSoKyThuat != null
                 ? new ThongSoKyThuat
                 {
                     KichThuocManHinh = btReq.ThongSoKyThuat.KichThuocManHinh?.Trim() ?? "Đang cập nhật",
                     DungLuongRam = string.IsNullOrWhiteSpace(btReq.ThongSoKyThuat.DungLuongRam?.Trim())
                                             ? (bienThe.Ram?.Trim() ?? "Đang cập nhật")
                                             : btReq.ThongSoKyThuat.DungLuongRam.Trim(),
                     SoKheRam = btReq.ThongSoKyThuat.SoKheRam?.Trim() ?? "1",
                     OCung = string.IsNullOrWhiteSpace(btReq.ThongSoKyThuat.OCung?.Trim())
                                             ? (bienThe.OCung?.Trim() ?? "Đang cập nhật")
                                             : btReq.ThongSoKyThuat.OCung.Trim(),
                     Pin = btReq.ThongSoKyThuat.Pin?.Trim() ?? "Đang cập nhật",
                     HeDieuHanh = btReq.ThongSoKyThuat.HeDieuHanh?.Trim() ?? "Đang cập nhật",
                     DoPhanGiaiManHinh = btReq.ThongSoKyThuat.DoPhanGiaiManHinh?.Trim() ?? "Đang cập nhật",
                     LoaiXuLyTrungTam = string.IsNullOrWhiteSpace(btReq.ThongSoKyThuat.LoaiXuLyTrungTam?.Trim())
                                             ? (bienThe.BoXuLyTrungTam?.Trim() ?? "Đang cập nhật")
                                             : btReq.ThongSoKyThuat.LoaiXuLyTrungTam.Trim(),
                     LoaiXuLyDoHoa = string.IsNullOrWhiteSpace(btReq.ThongSoKyThuat.LoaiXuLyDoHoa?.Trim())
                                             ? (bienThe.BoXuLyDoHoa?.Trim() ?? "Đang cập nhật")
                                             : btReq.ThongSoKyThuat.LoaiXuLyDoHoa.Trim(),
                     CongGiaoTiep = btReq.ThongSoKyThuat.CongGiaoTiep?.Trim() ?? "Đang cập nhật"
                 }
                 : new ThongSoKyThuat
                 {
                     KichThuocManHinh = "Đang cập nhật",
                     DungLuongRam = bienThe.Ram?.Trim() ?? "Đang cập nhật",
                     SoKheRam = "1",
                     OCung = bienThe.OCung?.Trim() ?? "Đang cập nhật",
                     Pin = "Đang cập nhật",
                     HeDieuHanh = "Đang cập nhật",
                     DoPhanGiaiManHinh = "Đang cập nhật",
                     LoaiXuLyTrungTam = bienThe.BoXuLyTrungTam?.Trim() ?? "Đang cập nhật",
                     LoaiXuLyDoHoa = bienThe.BoXuLyDoHoa?.Trim() ?? "Đang cập nhật",
                     CongGiaoTiep = "Đang cập nhật"
                 };

                product.BienThe.Add(bienThe);
            }

            // 4. Upload hình ảnh với validation
            var uploadedImages = new List<string>();
            try
            {
                int stt = 1;
                var firstVariantName = product.BienThe.FirstOrDefault()?.TenBienThe ?? "default";

                foreach (var file in request.HinhAnh)
                {
                    if (file == null || file.Length == 0) continue;

                    try
                    {
                        var isAnhChinh = (stt == 1);

                        var duongDanAnh = await _fileService.UploadProductImageAsync(
                            file,
                            product.TenSanPham,
                            firstVariantName,
                            isAnhChinh,
                            stt
                        );

                        uploadedImages.Add(duongDanAnh);

                        product.HinhAnhSanPham.Add(new HinhAnhSanPham
                        {
                            DuongDanAnh = duongDanAnh,
                            AnhChinh = isAnhChinh,
                            ThuTuAnh = stt,
                            NgayXoa = null
                        });

                        stt++;
                    }
                    catch (ArgumentException ex)
                    {
                        // Nếu có lỗi validation file, xóa các file đã upload và throw exception
                        foreach (var uploadedFile in uploadedImages)
                        {
                            await _fileService.DeleteAsync(uploadedFile);
                        }
                        throw new ArgumentException($"Lỗi upload hình ảnh: {ex.Message}");
                    }
                }

                if (product.HinhAnhSanPham.Count == 0)
                    throw new ArgumentException("Không có hình ảnh hợp lệ nào được upload");
            }
            catch (Exception ex)
            {
                // Rollback: xóa tất cả file đã upload
                foreach (var uploadedFile in uploadedImages)
                {
                    await _fileService.DeleteAsync(uploadedFile);
                }
                throw new Exception($"Lỗi xử lý hình ảnh: {ex.Message}", ex);
            }

            // 5. Lưu vào DB
            _db.SanPham.Add(product);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Rollback: xóa tất cả file đã upload
                foreach (var uploadedFile in uploadedImages)
                {
                    await _fileService.DeleteAsync(uploadedFile);
                }

                var errorMsg = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine($"Lỗi khi tạo sản phẩm: {errorMsg}");
                throw new Exception($"Lỗi lưu sản phẩm vào database: {errorMsg}", ex);
            }

            // 6. Trả về kết quả
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
            if (!string.IsNullOrWhiteSpace(request.TenSanPham) &&
                !string.Equals(request.TenSanPham.Trim(), product.TenSanPham?.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                bool duplicate = await _db.SanPham.AnyAsync(x =>
                    x.TenSanPham.Trim().ToLower() == request.TenSanPham.Trim().ToLower() &&
                    x.NgayXoa == null &&
                    x.MaSanPham != id);

                if (duplicate)
                    throw new InvalidOperationException($"Sản phẩm '{request.TenSanPham}' đã tồn tại.");

                product.TenSanPham = request.TenSanPham.Trim();
                product.Slug = _slugHelper.GenerateSlug(request.TenSanPham);
            }

            if (request.SoLuongTon >= 0)
                product.SoLuongTon = request.SoLuongTon;

            if (request.MaDanhMuc.HasValue)
                product.MaDanhMuc = request.MaDanhMuc.Value;

            if (request.MaThuongHieu.HasValue)
                product.MaThuongHieu = request.MaThuongHieu.Value;

           
            if (request.HinhAnhXoa?.Any() == true)
            {
                var imagesToDelete = product.HinhAnhSanPham
                    .Where(img => request.HinhAnhXoa.Contains(img.MaHinhAnh))
                    .ToList();

                foreach (var img in imagesToDelete)
                {
                    await _fileService.DeleteAsync(img.DuongDanAnh);
                    img.NgayXoa = DateTime.UtcNow;
                }
            }

            
            List<HinhAnhSanPham> newlyAddedImages = new List<HinhAnhSanPham>();

            if (request.HinhAnhMoi?.Any() == true)
            {
                int maxThuTu = product.HinhAnhSanPham
                    .Where(img => img.NgayXoa == null)
                    .Select(img => img.ThuTuAnh)
                    .DefaultIfEmpty(0)
                    .Max();

                int stt = maxThuTu + 1;
                bool isFirstNewImage = true;

                foreach (var file in request.HinhAnhMoi)
                {
                    if (file == null || file.Length == 0) continue;

                    bool willBeMainImage = isFirstNewImage && request.AnhMoiDauTienLaAnhChinh;

                    var duongDanAnh = await _fileService.UploadProductImageAsync(
                        file,
                        product.TenSanPham ?? "SanPham",
                        "BienTheMacDinh",
                        willBeMainImage,
                        stt
                    );

                    var newImage = new HinhAnhSanPham
                    {
                        DuongDanAnh = duongDanAnh,
                        AnhChinh = false,
                        ThuTuAnh = stt,
                        MaSanPham = product.MaSanPham
                    };

                    product.HinhAnhSanPham.Add(newImage);
                    newlyAddedImages.Add(newImage);

                    isFirstNewImage = false;
                    stt++;
                }
            }


            foreach (var img in product.HinhAnhSanPham.Where(i => i.NgayXoa == null))
            {
                img.AnhChinh = false;
            }

            bool mainImageSet = false;

            // Trường hợp 1: Client chỉ định ảnh cũ làm ảnh chính
            if (request.MaAnhChinh.HasValue && request.MaAnhChinh.Value > 0)
            {
                var selectedMainImage = product.HinhAnhSanPham
                    .FirstOrDefault(img => img.MaHinhAnh == request.MaAnhChinh.Value && img.NgayXoa == null);

                if (selectedMainImage != null)
                {
                    selectedMainImage.AnhChinh = true;
                    mainImageSet = true;
                    await RenameImageToMainAsync(selectedMainImage, product.TenSanPham);
                }
            }

            // Trường hợp 2: Ảnh mới đầu tiên làm ảnh chính
            if (!mainImageSet && request.AnhMoiDauTienLaAnhChinh && newlyAddedImages.Any())
            {
                var newMainImage = newlyAddedImages.First();
                newMainImage.AnhChinh = true;
                mainImageSet = true;
            }

            // Trường hợp 3: Fallback - Chọn ảnh đầu tiên theo thứ tự
            if (!mainImageSet)
            {
                var firstImage = product.HinhAnhSanPham
                    .Where(img => img.NgayXoa == null)
                    .OrderBy(img => img.ThuTuAnh)
                    .FirstOrDefault();

                if (firstImage != null)
                {
                    firstImage.AnhChinh = true;
                    await RenameImageToMainAsync(firstImage, product.TenSanPham );
                }
            }

            // Đổi tên các ảnh phụ
            var secondaryImages = product.HinhAnhSanPham
                .Where(i => i.NgayXoa == null && !i.AnhChinh)
                .ToList();

            foreach (var img in secondaryImages)
            {
                await RenameImageToSecondaryAsync(img, product.TenSanPham);
            }

            // ===== XỬ LÝ XÓA BIẾN THỂ =====
            if (request.BienTheXoa?.Any() == true)
            {
                var now = DateTime.UtcNow;
                var ids = request.BienTheXoa.ToHashSet();

                foreach (var bt in product.BienThe.Where(x => ids.Contains(x.MaBTSP) && x.NgayXoa == null))
                {
                    bt.NgayXoa = now;
                    bt.TrangThai = false;

                    if (bt.thongSoKyThuat != null)
                    {
                        _db.ThongSoKyThuat.Remove(bt.thongSoKyThuat);
                        bt.thongSoKyThuat = null;
                    }
                }
            }

            // ===== CẬP NHẬT BIẾN THỂ =====
            if (request.BienThe?.Any() == true)
            {
                foreach (var req in request.BienThe)
                {
                    if (req.MaBTSP.HasValue && req.MaBTSP > 0)
                    {
                        // Cập nhật biến thể cũ
                        var bt = product.BienThe
                            .FirstOrDefault(x => x.MaBTSP == req.MaBTSP && x.NgayXoa == null);

                        if (bt == null) continue;

                        bt.TenBienThe = req.TenBienThe?.Trim() ?? bt.TenBienThe;
                        bt.GiaBan = req.GiaBan;
                        bt.GiaKhuyenMai = req.GiaKhuyenMai;
                        bt.MauSac = req.MauSac?.Trim() ?? bt.MauSac;
                        bt.Ram = req.Ram?.Trim() ?? bt.Ram;
                        bt.OCung = req.OCung?.Trim() ?? bt.OCung;
                        bt.BoXuLyTrungTam = req.BoXuLyTrungTam?.Trim() ?? bt.BoXuLyTrungTam;
                        bt.BoXuLyDoHoa = req.BoXuLyDoHoa?.Trim() ?? bt.BoXuLyDoHoa;
                        bt.SoLuongTon = req.SoLuongTon;

                        if (req.TrangThai.HasValue)
                            bt.TrangThai = req.TrangThai.Value;

                        if (req.ThongSoKyThuat != null)
                        {
                            bt.thongSoKyThuat ??= new ThongSoKyThuat { MaBienThe = bt.MaBTSP };

                            var ts = bt.thongSoKyThuat;
                            ts.KichThuocManHinh = req.ThongSoKyThuat.KichThuocManHinh?.Trim() ?? ts.KichThuocManHinh;
                            ts.DungLuongRam = req.ThongSoKyThuat.DungLuongRam?.Trim() ?? bt.Ram ?? "Đang cập nhật";
                            ts.SoKheRam = req.ThongSoKyThuat.SoKheRam?.Trim() ?? ts.SoKheRam;
                            ts.OCung = req.ThongSoKyThuat.OCung?.Trim() ?? ts.OCung;
                            ts.Pin = req.ThongSoKyThuat.Pin?.Trim() ?? ts.Pin;
                            ts.HeDieuHanh = req.ThongSoKyThuat.HeDieuHanh?.Trim() ?? ts.HeDieuHanh;
                            ts.DoPhanGiaiManHinh = req.ThongSoKyThuat.DoPhanGiaiManHinh?.Trim() ?? ts.DoPhanGiaiManHinh;
                            ts.LoaiXuLyTrungTam = req.ThongSoKyThuat.LoaiXuLyTrungTam?.Trim() ?? ts.LoaiXuLyTrungTam;
                            ts.LoaiXuLyDoHoa = req.ThongSoKyThuat.LoaiXuLyDoHoa?.Trim() ?? ts.LoaiXuLyDoHoa;
                            ts.CongGiaoTiep = req.ThongSoKyThuat.CongGiaoTiep?.Trim() ?? ts.CongGiaoTiep;
                        }
                    }
                    else
                    {
                        // Thêm biến thể mới
                        var newVariant = new BienThe
                        {
                            MaSanPham = product.MaSanPham,
                            TenBienThe = req.TenBienThe?.Trim() ?? "Đang cập nhật",
                            GiaBan = req.GiaBan,
                            GiaKhuyenMai = req.GiaKhuyenMai,
                            MauSac = req.MauSac?.Trim() ?? "Đang cập nhật",
                            Ram = req.Ram?.Trim() ?? "Đang cập nhật",
                            OCung = req.OCung?.Trim() ?? "Đang cập nhật",
                            BoXuLyTrungTam = req.BoXuLyTrungTam?.Trim() ?? "Đang cập nhật",
                            BoXuLyDoHoa = req.BoXuLyDoHoa?.Trim() ?? "Đang cập nhật",
                            SoLuongTon = req.SoLuongTon,
                            TrangThai = req.TrangThai ?? true
                        };

                        newVariant.thongSoKyThuat = new ThongSoKyThuat
                        {
                            DungLuongRam = newVariant.Ram,
                            OCung = newVariant.OCung,
                            LoaiXuLyTrungTam = newVariant.BoXuLyTrungTam,
                            LoaiXuLyDoHoa = newVariant.BoXuLyDoHoa,
                            KichThuocManHinh = req.ThongSoKyThuat?.KichThuocManHinh ?? "Đang cập nhật",
                            SoKheRam = req.ThongSoKyThuat?.SoKheRam ?? "1",
                            Pin = req.ThongSoKyThuat?.Pin ?? "Đang cập nhật",
                            HeDieuHanh = req.ThongSoKyThuat?.HeDieuHanh ?? "Đang cập nhật",
                            DoPhanGiaiManHinh = req.ThongSoKyThuat?.DoPhanGiaiManHinh ?? "Đang cập nhật",
                            CongGiaoTiep = req.ThongSoKyThuat?.CongGiaoTiep ?? "Đang cập nhật"
                        };

                        product.BienThe.Add(newVariant);
                    }
                }
            }

           
            await _db.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        
        private async Task RenameImageToMainAsync(HinhAnhSanPham image, string productName)
        {
            await Task.Run(() =>
            {
                try
                {
                    var oldPath = Path.Combine(_webHostEnvironment.WebRootPath, image.DuongDanAnh);

                    if (!IOFile.Exists(oldPath))
                        return;

                    var fileName = Path.GetFileName(image.DuongDanAnh);

                    if (fileName.Contains("_AnhChinh-"))
                        return;

                    var newFileName = fileName.Replace("_AnhPhu-", "_AnhChinh-");

                    if (newFileName == fileName)
                    {
                        var extension = Path.GetExtension(fileName);
                        var nameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
                        newFileName = $"{nameWithoutExt}_AnhChinh{extension}";
                    }

                    var directory = Path.GetDirectoryName(oldPath);
                    var newPath = Path.Combine(directory!, newFileName);

                    if (IOFile.Exists(newPath))
                    {
                        IOFile.Delete(newPath);
                    }

                    IOFile.Move(oldPath, newPath);

                    image.DuongDanAnh = $"product/image/{newFileName}";
                }
                catch (Exception)
                {
                    // Silent fail
                }
            });
        }

        private async Task RenameImageToSecondaryAsync(HinhAnhSanPham image, string productName)
        {
            await Task.Run(() =>
            {
                try
                {
                    var oldPath = Path.Combine(_webHostEnvironment.WebRootPath, image.DuongDanAnh);

                    if (!IOFile.Exists(oldPath))
                        return;

                    var fileName = Path.GetFileName(image.DuongDanAnh);

                    if (fileName.Contains("_AnhPhu-"))
                        return;

                    var newFileName = fileName.Replace("_AnhChinh-", "_AnhPhu-");

                    if (newFileName == fileName)
                    {
                        var extension = Path.GetExtension(fileName);
                        var nameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
                        newFileName = $"{nameWithoutExt}_AnhPhu{extension}";
                    }

                    var directory = Path.GetDirectoryName(oldPath);
                    var newPath = Path.Combine(directory!, newFileName);

                    if (IOFile.Exists(newPath))
                    {
                        IOFile.Delete(newPath);
                    }

                    IOFile.Move(oldPath, newPath);

                    image.DuongDanAnh = $"product/image/{newFileName}";
                }
                catch (Exception)
                {
                    // Silent fail
                }
            });
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

        public async Task<PagedResult<ProductListItem>> GetProductsByBrandPagingAsync(
     int maThuongHieu,
     int page = 1,
     int pageSize = 12,
     int? maDanhMuc = null,
     decimal? giaMin = null,
     decimal? giaMax = null)
        {
            var query = _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai == true &&
                    x.MaThuongHieu == maThuongHieu
                );

            // Lọc theo danh mục
            if (maDanhMuc.HasValue)
            {
                query = query.Where(x => x.MaDanhMuc == maDanhMuc.Value);
            }

            // Lọc theo giá
            if (giaMin.HasValue || giaMax.HasValue)
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    (!giaMin.HasValue || bt.GiaBan >= giaMin.Value) &&
                    (!giaMax.HasValue || bt.GiaBan <= giaMax.Value)
                ));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();

            return new PagedResult<ProductListItem>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = items
            };
        }

        public async Task<PagedResult<ProductListItem>> GetProductsByCategoryPagingAsync(
            int maDanhMuc,
            int page = 1,
            int pageSize = 12,
            int? maThuongHieu = null,
            decimal? giaMin = null,
            decimal? giaMax = null)
        {
            var query = _db.SanPham
                .Include(x => x.DanhMuc)
                .Include(x => x.ThuongHieu)
                .Include(x => x.HinhAnhSanPham)
                .Include(x => x.BienThe)
                .Where(x =>
                    x.NgayXoa == null &&
                    x.TrangThai == true &&
                    x.MaDanhMuc == maDanhMuc
                );

            // Lọc theo thương hiệu
            if (maThuongHieu.HasValue)
            {
                query = query.Where(x => x.MaThuongHieu == maThuongHieu.Value);
            }

            // Lọc theo giá
            if (giaMin.HasValue || giaMax.HasValue)
            {
                query = query.Where(x => x.BienThe.Any(bt =>
                    bt.NgayXoa == null &&
                    (!giaMin.HasValue || bt.GiaBan >= giaMin.Value) &&
                    (!giaMax.HasValue || bt.GiaBan <= giaMax.Value)
                ));
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => MapToProductListItem(x))
                .ToListAsync();

            return new PagedResult<ProductListItem>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = items
            };
        }

        private ProductResult MapToProductResult(SanPham sp)
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
                    .Select(x => new ProductImageResult
                    {
                        MaHinhAnh = x.MaHinhAnh,
                        DuongDan = $"{_config["AppSettings:BaseUrl"]}/product/image/{x.DuongDanAnh}",
                        AnhChinh = x.AnhChinh,
                        ThuTuAnh = x.ThuTuAnh
                    })
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