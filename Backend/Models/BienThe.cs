using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class BienThe
    {
        [Key]
        public int MaBTSP { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaBan { get; set; }
        public string MauSac { get; set; } = null!;
        public string Ram { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string ManHinh { get; set; } = null!;
        public string BoXuLyDoHoa { get; set; } = null!;
        public string BoxuLyTrungTam { get; set; } = null!;
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaKhuyeMai { get; set; }
        public int SoLuongTon { get; set; }
        public bool TrangThai { get; set; } = true;
        //public int MaSanPham { get; set; }

        //[ForeignKey("MaSanPham")]
        //public ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();

        //public int MaHinhAnhSanPham { set; get; }

        //[ForeignKey("MaHinhAnhSanPham")]
        //public ICollection<HinhAnhSanPham> HinhAnhSanPham { set; get; } = new List<HinhAnhSanPham>();

    }
}
