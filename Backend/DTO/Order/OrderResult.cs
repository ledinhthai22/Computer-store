using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.User;
using Backend.Models;
namespace Backend.DTO.Order
{
    public class OrderResult
    {
        public int MaDonHang { get; set; }
        public string MaDon { get; set; } = null!;
        public Decimal TongTien { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public string TrangThai { get; set; }  
        public string NgayTao { get; set; }
        public OrderCustomer KhachHang { get; set; } = null!;
        public OrderAddress DiaChi { get; set; } = null!;
        public List<OrderDetail> ChiTietDonHang { get; set; } = null!;
        public string GhiChu { get; set; } = null!;
        public string GhiChuNoiBo { get; set; } = null!;
    }
    public class OrderCustomer
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
    }
    public class OrderAddress
    {
        public string TenNguoiNhan { get; set; }
        public string SoDienThoai { get; set; }
        public string TinhThanh { get; set; }
        public string PhuongXa { get; set; }
        public string DiaChi { get; set; }
    }
    public class OrderDetail
    {
        public int MaBienThe { get; set; }
        public string TenBienThe { get; set; }
        public int SoLuong { get; set; }
    }
}
