using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ThuongHieu
    {
        [Key]
        public int MaThuongHieu { get; set; }

        [Required]
        public string TenThuongHieu { get; set; } = null!;
        
        public bool TrangThai { get; set; } = true;

        // 1 ThuongHieu - N SanPham
        public ICollection<SanPham> SanPham { get; set; } = new List<SanPham>();
    }
}