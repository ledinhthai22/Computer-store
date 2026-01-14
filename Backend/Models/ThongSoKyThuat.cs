using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ThongSoKyThuat
    {
        [Key]
        public int MaThongSo { get; set; }

        public string KichThuocManHinh { get; set; } = null!;
        public string DungLuongRam { get; set; } = null!;
        public string SoKheRam { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string Pin { get; set; } = null!;
        public string HeDieuHanh { get; set; } = null!;
        public string DoPhanGiaiManHinh { get; set; } = null!;
        public string LoaiXuLyTrungTam { get; set; } = null!;
        public string LoaiXuLyDoHoa { get; set; } = null!;
        public string CongGiaoTiep { get; set; } = null!;

        public int MaBienThe { get; set; }

        [ForeignKey(nameof(MaBienThe))]
        public BienThe BienThe { get; set; } = null!;
    }
}
