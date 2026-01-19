namespace Ecommerce.DTO.DeliveryAddress
{
    public class DeliveryAddressRespone
    {
        public int MaDiaChiNhanHang { get; set; }
        public string TenNguoiNhan { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string PhuongXa { get; set; } = string.Empty;
        public string TinhThanh { get; set; } = string.Empty;
        public bool DiaChiMacDinh { get; set; }
    }
}
