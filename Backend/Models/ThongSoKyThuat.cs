using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ThongSoKyThuat
    {
        [Key]
        public int MaThongSo { get; set; }

        public string? KichThuocManHinh { get; set; }
        public string? DungLuongRam { get; set; } 
        public string? SoKheRam { get; set; }
        public string? OCung { get; set; } 
        public string? Pin { get; set; } 
        public string? HeDieuHanh { get; set; } 
        public string? DoPhanGiaiManHinh { get; set; }
        public string? LoaiXuLyTrungTam { get; set; } 
        public string? LoaiXuLyDoHoa { get; set; } 
        public string? CongGiaoTiep { get; set; }

        public int MaBienThe { get; set; }

        [ForeignKey(nameof(MaBienThe))]
        public BienThe BienThe { get; set; } = null!;
    }
}
