using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce.Models;

namespace Backend.Models
{
    public class BienThe
    {
        [Key]
        public int MaBTSP { get; set; }
        public string TenBienThe { get; set; } = null!;
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaBan { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaKhuyenMai { get; set; }
        public string MauSac { get; set; } = null!;
        public string Ram { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string BoXuLyDoHoa { get; set; } = null!;
        public string BoXuLyTrungTam { get; set; } = null!;
        public int SoLuongTon { get; set; }
        public bool TrangThai { get; set; } = true;
        public DateTime NgayXoa { get; set; } 
        public int MaSanPham { get; set; }
        [ForeignKey(nameof(MaSanPham))]
        public SanPham SanPham { get; set; } = null!;
        public ICollection<HinhAnhSanPham> HinhAnhSanPham { get; set; } = new List<HinhAnhSanPham>();
        public ICollection<ChiTietGioHang> ChiTietGioHang { get; set; } = new List<ChiTietGioHang>();
        public ICollection<YeuThich> YeuThich { get; set; } = new List<YeuThich>();
        public ICollection<DonHang> DonHang { get; set; } = new List<DonHang>();
    }
}