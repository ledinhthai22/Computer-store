using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class VaiTro
    {
        [Key]
        public int MaVaiTro { get; set; }
        [Required]
        public string TenVaiTro { get; set; } = null!;
        public ICollection<NguoiDung> NguoiDung { get; set; } = new List<NguoiDung>();
    }
}