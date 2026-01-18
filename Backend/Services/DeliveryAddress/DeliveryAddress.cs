using System.Net.Http.Json;
using Backend.Data;
using Backend.Models;
using Ecommerce.DTO.DeliveryAddress;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ecommerce.Services.DeliveryAddress;

public class ProvinceOptions
{
    public string BaseUrl { get; set; } = "https://provinces.open-api.vn/api/v2";
}

public class DeliveryAddressService : IDeliveryAddress
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly ApplicationDbContext _DbContext;

    public DeliveryAddressService(HttpClient httpClient, IOptions<ProvinceOptions> options,ApplicationDbContext DbContext)
    {
        _httpClient = httpClient;
        _baseUrl = options.Value.BaseUrl.TrimEnd('/');
        _DbContext = DbContext;
    }

    public async Task<List<Province>> GetAllProvincesAsync(bool withWards = false)
    {
        string url = $"{_baseUrl}/";
        if (withWards) url += "?depth=2";

        var provinces = await _httpClient.GetFromJsonAsync<List<Province>>(url);
        return provinces ?? new List<Province>();
    }

    public async Task<Province?> GetProvinceByCodeAsync(int code, bool withWards = false)
    {
        string url = $"{_baseUrl}/p/{code}";
        if (withWards) url += "?depth=2";

        return await _httpClient.GetFromJsonAsync<Province>(url);
    }
    public async Task<List<DeliveryAddressRespone>> GetAddressesByUserAsync(int maNguoiDung)
    {
        var addresses = await _DbContext.DiaChiNhanHang
            .Where(d => d.MaNguoiDung == maNguoiDung && d.NgayXoa == null)
            .OrderByDescending(d => d.DiaChiMacDinh)
            .ThenByDescending(d => d.MaDiaChiNhanHang)
            .ToListAsync();

        return addresses.Select(d => new DeliveryAddressRespone
        {
            MaDiaChiNhanHang = d.MaDiaChiNhanHang,
            TenNguoiNhan = d.TenNguoiNhan,
            SoDienThoai = d.SoDienThoai,
            DiaChi = d.DiaChi,
            PhuongXa = d.PhuongXa,
            TinhThanh = d.TinhThanh,
            DiaChiMacDinh = d.DiaChiMacDinh
        }).ToList();
    }

    public async Task<DeliveryAddressRespone?> GetAddressByIdAsync(int maDiaChi, int maNguoiDung)
    {
        var diaChi = await _DbContext.DiaChiNhanHang
            .FirstOrDefaultAsync(d => d.MaDiaChiNhanHang == maDiaChi && d.MaNguoiDung == maNguoiDung && d.NgayXoa == null);

        if (diaChi == null) return null;

        return new DeliveryAddressRespone
        {
            MaDiaChiNhanHang = diaChi.MaDiaChiNhanHang,
            TenNguoiNhan = diaChi.TenNguoiNhan,
            SoDienThoai = diaChi.SoDienThoai,
            DiaChi = diaChi.DiaChi,
            PhuongXa = diaChi.PhuongXa,
            TinhThanh = diaChi.TinhThanh,
            DiaChiMacDinh = diaChi.DiaChiMacDinh
        };
    }

    public async Task<DeliveryAddressRespone> CreateAddressAsync(CreateDeliveryAddress dto, int maNguoiDung)
    {
        try
        {
            var diaChi = new DiaChiNhanHang
            {
                TenNguoiNhan = dto.TenNguoiNhan,
                SoDienThoai = dto.SoDienThoai,
                DiaChi = dto.DiaChi,
                PhuongXa = dto.PhuongXa,
                TinhThanh = dto.TinhThanh,
                MaNguoiDung = maNguoiDung,
                NgayXoa = null, // rõ ràng gán null (sau khi cột cho phép NULL)
                DiaChiMacDinh = false // mặc định false, chỉ set true nếu là đầu tiên
            };

            // Tự động set mặc định nếu user chưa có địa chỉ nào
            var hasAny = await _DbContext.DiaChiNhanHang
                .AnyAsync(d => d.MaNguoiDung == maNguoiDung && d.NgayXoa == null);

            if (!hasAny)
            {
                diaChi.DiaChiMacDinh = true;
            }

            _DbContext.DiaChiNhanHang.Add(diaChi);
            await _DbContext.SaveChangesAsync();

            return new DeliveryAddressRespone
            {
                MaDiaChiNhanHang = diaChi.MaDiaChiNhanHang,
                TenNguoiNhan = diaChi.TenNguoiNhan,
                SoDienThoai = diaChi.SoDienThoai,
                DiaChi = diaChi.DiaChi,
                PhuongXa = diaChi.PhuongXa,
                TinhThanh = diaChi.TinhThanh,
                DiaChiMacDinh = diaChi.DiaChiMacDinh
            };
        }
        catch (DbUpdateException dbEx)
        {
            // Log chi tiết lỗi database
            Console.WriteLine($"DbUpdateException: {dbEx.InnerException?.Message}");
            throw new Exception("Lỗi lưu địa chỉ vào database: " + dbEx.InnerException?.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi tạo địa chỉ: {ex.Message}\nStack: {ex.StackTrace}");
            throw;
        }
    }

    public async Task<bool> UpdateAddressAsync(int maDiaChi, CreateDeliveryAddress request, int maNguoiDung)
    {
        var diaChi = await _DbContext.DiaChiNhanHang
            .FirstOrDefaultAsync(d => d.MaDiaChiNhanHang == maDiaChi && d.MaNguoiDung == maNguoiDung && d.NgayXoa == null);

        if (diaChi == null) return false;

        diaChi.TenNguoiNhan = request.TenNguoiNhan;
        diaChi.SoDienThoai = request.SoDienThoai;
        diaChi.DiaChi = request.DiaChi;
        diaChi.PhuongXa = request.PhuongXa;
        diaChi.TinhThanh = request.TinhThanh;
        // Không cập nhật DiaChiMacDinh ở đây (phải dùng SetDefault riêng)

        await _DbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAddressAsync(int maDiaChi, int maNguoiDung)
    {
        var diaChi = await _DbContext.DiaChiNhanHang
            .FirstOrDefaultAsync(d => d.MaDiaChiNhanHang == maDiaChi && d.MaNguoiDung == maNguoiDung && d.NgayXoa == null);

        if (diaChi == null) return false;

        diaChi.NgayXoa = DateTime.Now;

        // Nếu đang mặc định → chuyển sang địa chỉ khác
        if (diaChi.DiaChiMacDinh)
        {
            var other = await _DbContext.DiaChiNhanHang
                .FirstOrDefaultAsync(d => d.MaNguoiDung == maNguoiDung && d.MaDiaChiNhanHang != maDiaChi && d.NgayXoa == null);

            if (other != null)
            {
                other.DiaChiMacDinh = true;
            }
        }

        await _DbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetDefaultAddressAsync(int maDiaChi, int maNguoiDung)
    {
        var target = await _DbContext.DiaChiNhanHang
            .FirstOrDefaultAsync(d => d.MaDiaChiNhanHang == maDiaChi && d.MaNguoiDung == maNguoiDung && d.NgayXoa == null);

        if (target == null) return false;

        // Bỏ mặc định tất cả
        var all = await _DbContext.DiaChiNhanHang
            .Where(d => d.MaNguoiDung == maNguoiDung && d.NgayXoa == null)
            .ToListAsync();

        foreach (var addr in all)
        {
            addr.DiaChiMacDinh = addr.MaDiaChiNhanHang == maDiaChi;
        }

        await _DbContext.SaveChangesAsync();
        return true;
    }
}