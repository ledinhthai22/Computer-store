using Ecommerce.DTO.DeliveryAddress;

namespace Ecommerce.Services.DeliveryAddress;

public interface IDeliveryAddress
{
    Task<List<Province>> GetAllProvincesAsync(bool withWards = false);
    Task<Province?> GetProvinceByCodeAsync(int code, bool withWards = false);
    Task<List<DeliveryAddressRespone>> GetAddressesByUserAsync(int maNguoiDung);
    Task<DeliveryAddressRespone?> GetAddressByIdAsync(int maDiaChi, int maNguoiDung);
    Task<DeliveryAddressRespone> CreateAddressAsync(CreateDeliveryAddress request, int maNguoiDung);
    Task<bool> UpdateAddressAsync(int maDiaChi, CreateDeliveryAddress request, int maNguoiDung);
    Task<bool> DeleteAddressAsync(int maDiaChi, int maNguoiDung);
    Task<bool> SetDefaultAddressAsync(int maDiaChi, int maNguoiDung);
}