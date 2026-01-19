namespace Backend.DTO.Cart
{
    public class CartResult 
    {
        public int MaNguoiDung { get; set; }
        public int MaBienThe { get; set; }
        public int SoLuong { get; set; }
        public int SoLuongTon { get; set; }
        public string TenSanPham { get; set; } = string.Empty;
        public string DuongDanAnh { get; set; } = string.Empty;
        public string GiaBan { get; set; } = string.Empty;
        public string GiaKhuyenMai { get; set; } = string.Empty;
    }
}