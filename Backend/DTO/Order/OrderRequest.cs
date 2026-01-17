using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.User;
using Backend.Models;
namespace Backend.DTO.Order
{
    public class UpdateOrderStatusRequest
    {
        public int TrangThai { get; set; }
    }
    public class CreateOrderInfoRequest
    {
        public decimal TongTienGoc { get; set; }
        public decimal TongTienThanhToan { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public int MaKH { get; set; }
        public int MaDiaChiNhanHang { get; set; }
        public List<CreateOrderDetailRequest> ChiTietDonHang { get; set; } = null!; 
        public string GhiChu { get; set; } = string.Empty;
        public string GhiChuNoiBo { get; set; } = string.Empty;
        public string NguoiNhan { get; set; } = string.Empty;
        public string SoDienThoaiNguoiNhan { get; set; } = string.Empty;
        public string TinhThanh { get; set; } = string.Empty;
        public string PhuongXa { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }
    public class CreateOrderDetailRequest
    {
        public int MaBienThe { get; set; }
        public int SoLuong { get; set; }
    }
    public class CheckoutCartRequest
    {
        public List<int> SelectedVariantIds { get; set; } = new List<int>();
        public int MaDiaChiNhanHang { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public decimal TongTienGoc { get; set; }
        public decimal TongTienThanhToan { get; set; }
        public string? GhiChu { get; set; }
    }
    public class UpdateOrderInfo
    {
        public string GhiChu { get; set; } = string.Empty;
        public string GhiChuNoiBo { get; set; } = string.Empty;
        public string NguoiNhan { get; set; } = string.Empty;
        public string SoDienThoaiNguoiNhan { get; set; } = string.Empty;
        public string TinhThanh { get; set; } = string.Empty;
        public string PhuongXa { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
    }
}
