using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ThongSoKyThuat
    {
        [Key]
        public int MaThongSo { get; set; }

        public string KichThuocManHinh { get; set; } = null!;
        public string SoKheRam { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string Pin { get; set; } = null!;
        public string HeDieuHanh { get; set; } = null!;
        public string DoPhanGiaiManHinh { get; set; } = null!;


        public SanPham? SanPham { get; set; }
    }
}