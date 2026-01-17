using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductVariantResult
    {
        public int MaBTSP { get; set; }
        public string TenBienThe { get; set; } = null!;
        public decimal GiaBan { get; set; }
        public decimal GiaKhuyenMai { get; set; }
        public string MauSac { get; set; } = null!;
        public string Ram { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string BoXuLyTrungTam { get; set; } = null!;
        public string BoXuLyDoHoa { get; set; } = null!;
        public int SoLuongTon { get; set; }
        public bool TrangThai { get; set; }
        public ProductSpecificationsResult? ThongSoKyThuat { get; set; }
    }
}
