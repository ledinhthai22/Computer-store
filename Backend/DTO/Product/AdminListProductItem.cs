using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class AdminListProductItem
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string TenDanhMuc { get; set; } = null!;
        public string TenThuongHieu { get; set; } = null!;
        public int TongSoLuong { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}