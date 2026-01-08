using Microsoft.AspNetCore.Mvc;

namespace Backend.DTO.Cart
{
    public class CartReuslt 
    { 
        public int MaNguoiDung { get; set; }
        public int MaBienThe { get; set; }
        public int SoLuong { get; set; }
        public string TenSanPham { get; set; }
        public string DuongDanAnh { get; set; }
        public string GiaBan { get; set; }
        public string GiaKhuyenMai { get; set; }
    }
}
