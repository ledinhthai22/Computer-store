using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ThongTinTrang
    {
        [Key]
        public int MaThongTinTrang { get; set; }
        public string TenKhoaCaiDat { get; set; } = null!;
        public string? GiaTriCaiDat { get; set; }
        public string? TomTat { get; set; }
        public string? MoTa { get; set; }
        public bool  TrangThai { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}