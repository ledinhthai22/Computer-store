using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductResult
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public decimal GiaCoBan { get; set; }
        public double KhuyenMai { get; set; }
        public int SoLuongTon { get; set; }
        public string TenDanhMuc { get; set; } = null!;
        public string TenThuongHieu { get; set; } = null!;
        public ProductSpecificationsResult ThongSoKyThuat { get; set; } = null!;
        public List<ProductVariantResult> BienThe { get; set; } = new();
        public DateTime NgayTao { get; set; }
         public string message {get;set;} = null!;
    }
}