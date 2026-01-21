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
        public string TrangThai { get; set; } = null!;
        public string NgayTao { get; set; } = null!;
        public string NgayXoa { get; set; } = null!;
        public OrderCustomer KhachHang { get; set; } = null!;
        public OrderAddress DiaChi { get; set; } = null!;
        public List<OrderDetail> ChiTietDonHang { get; set; } = null!;
        public string GhiChu { get; set; } = null!;
        public string GhiChuNoiBo { get; set; } = null!;
    }

    public class OrderCustomer
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
    }

    public class OrderAddress
    {
        public string TenNguoiNhan { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string TinhThanh { get; set; } = null!;
        public string PhuongXa { get; set; } = null!;
        public string DiaChi { get; set; } = null!;
    }

    public class OrderDetail
    {
        public int MaBienThe { get; set; }
        public string TenBienThe { get; set; } = null!;
        public int SoLuong { get; set; }
        public decimal GiaBan { get; set; }
        public decimal GiaKhuyenMai { get; set; }
        public decimal ThanhTien { get; set; }
        public string? HinhAnh { get; set; }
    }
}