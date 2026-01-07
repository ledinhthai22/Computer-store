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
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public decimal GiaCoBan { get; set; }
        public double DanhGiaTrungBinh { get; set; }
        public double KhuyenMai { get; set; }
        public int SoLuongTon { get; set; }
        public int LuotXem { get; set; }
        public int LuotMua { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public bool TrangThai { get; set; } = true;
        public DateTime? Delete_At {get;set;}
        public int MaDanhMuc { get; set; }
        [ForeignKey(nameof(MaDanhMuc))]
        public DanhMuc? DanhMuc { get; set; }


        public int MaThuongHieu { get; set; }
        [ForeignKey(nameof(MaThuongHieu))]
        public ThuongHieu? ThuongHieu { get; set; }


        public int MaThongSo { get; set; }
        [ForeignKey(nameof(MaThongSo))]
        public ThongSoKyThuat? ThongSoKyThuat { get; set; }


        public ICollection<BienThe> BienThe { get; set; } = new List<BienThe>(); 
        public ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();
    }
}