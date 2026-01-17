using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductListItem
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string TenDanhMuc { get; set; } = null!;
        public string TenThuongHieu { get; set; } = null!;
        public string? AnhDaiDien { get; set; }
        public decimal GiaNhoNhat { get; set; }
        public decimal GiaLonNhat { get; set; }
        public decimal? GiaKhuyenMaiNhoNhat { get; set; }
        public double DanhGiaTrungBinh { get; set; }
        public int LuotXem { get; set; }
        public int LuotMua { get; set; }
        public DateTime NgayTao { get; set; }
        public int SoLuongBienThe { get; set; }
        public bool CoKhuyenMai { get; set; }
    }
}