using System.ComponentModel.DataAnnotations;
using Ecommerce.DTO.Product;

namespace Backend.DTO.Product
{
    public class ProductVariantRequest
    {
        [Required]
        public string TenBienThe { get; set; } = null!;

        [Range(0, double.MaxValue)]
        public decimal GiaBan { get; set; }

        [Range(0, double.MaxValue)]
        public decimal GiaKhuyenMai { get; set; }

        public string MauSac { get; set; } = null!;
        public string Ram { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string BoXuLyTrungTam { get; set; } = null!;
        public string BoXuLyDoHoa { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int SoLuongTon { get; set; }

        // 🔥 1–1
        [Required]
        public ProductSpecificationFilterRequest ThongSoKyThuat { get; set; } = null!;
    }
}
