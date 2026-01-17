namespace Backend.DTO.Statistics
{
    public class SalesOverview
    {
        public int TongDonHang { get; set; }
        public decimal TongDoanhThu { get; set; }
        public List<Detail> ChiTietDoanhThu { get; set; }
    }
    public class Detail 
    {
        public string MocThoiGian { get; set; }
        public decimal DoanhThu { get; set; }
    }
    public class ProductSales
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; }
        public int TongSoLuongDaBan { get; set; }
        public decimal TongDoanhThu { get; set; }
    }
    public class  OrderStatus
    {
        public int TongDonHang { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
    }
}
