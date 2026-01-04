using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TrinhChieu
    {
        [Key]
        public int MaTrinhChieu { get; set; }
        public string DuongDanHinh { get; set; } = null!;
        public string DuongDanSanPham { get; set; } = null!;
        public int SoThuTu { get; set; }
        public bool TrangThai { get; set; } = true;
    }
}