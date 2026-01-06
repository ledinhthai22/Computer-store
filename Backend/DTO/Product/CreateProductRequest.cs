using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class CreateProductRequest
    {
        public string TenSanPham { get; set; } = null!;
        public decimal GiaCoBan { get; set; }
        public double KhuyenMai { get; set; }
        public int SoLuongTon { get; set; }
        public int MaDanhMuc { get; set; }
        public int MaThuongHieu { get; set; }
        public ProductSpecificationsRequest ThongSoKyThuat { get; set; } = null!;
        public List<ProductVariantResquest> BienThe { get; set; } = new ();
    }
}