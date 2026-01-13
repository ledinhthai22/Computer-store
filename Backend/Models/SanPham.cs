using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce.Models;

namespace Backend.Models
{
    public class SanPham
    {
        [Key]
        public int MaSanPham { get; set; }

        [Required]
        [MaxLength(255)]
        public string TenSanPham { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Slug { get; set; } = null!;

        public double DanhGiaTrungBinh { get; set; }

        public int LuotXem { get; set; }
        public int LuotMua { get; set; }

        public bool TrangThai { get; set; } = true;
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime? NgayXoa { get; set; }

        public int MaDanhMuc { get; set; }
        public int MaThuongHieu { get; set; }

        [ForeignKey(nameof(MaDanhMuc))]
        public DanhMuc? DanhMuc { get; set; }

        [ForeignKey(nameof(MaThuongHieu))]
        public ThuongHieu? ThuongHieu { get; set; }

        public ICollection<BienThe> BienThe { get; set; } = new List<BienThe>();
        public ICollection<HinhAnhSanPham> HinhAnhSanPham { get; set; } = new List<HinhAnhSanPham>();
        public ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();
    }
}
