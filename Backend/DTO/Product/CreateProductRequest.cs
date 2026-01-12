using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class CreateProductRequest
    {
        [Required]
        public string TenSanPham { get; set; } = null!;
        [Range(0, double.MaxValue)]
        public decimal GiaCoBan { get; set; }
        public double KhuyenMai { get; set; }
        [Range(0, int.MaxValue)]
        public int SoLuongTon { get; set; }
        [Required]
        public int MaDanhMuc { get; set; }
        [Required]
        public int MaThuongHieu { get; set; }
        [Required]
        public ProductSpecificationsRequest ThongSoKyThuat { get; set; } = null!;
        public List<ProductVariantResquest> BienThe { get; set; } = new();
    }
}