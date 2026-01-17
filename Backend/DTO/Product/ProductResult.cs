using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.DTO.Product;

namespace Backend.DTO.Product
{
    public class ProductResult
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public int SoLuongTon { get; set; }
        public int MaDanhMuc { get; set; }
        public int MaThuongHieu { get; set; }
        public string TenDanhMuc { get; set; } = null!;
        public string TenThuongHieu { get; set; } = null!;
        public List<ProductImageResult> HinhAnh { get; set; } = new();
        public List<ProductVariantResult> BienThe { get; set; } = new();
        public double DanhGiaTrungBinh { get; set; }
        public int LuotXem { get; set; }
        public int LuotMua { get; set; }
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}
