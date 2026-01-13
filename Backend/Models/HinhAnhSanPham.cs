using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class HinhAnhSanPham
    {
         [Key]
    public int MaHinhAnh { get; set; }

    [Required]
    [MaxLength(500)]
    public string DuongDanAnh { get; set; } = null!;

    public bool AnhChinh { get; set; }
    public int ThuTuAnh { get; set; }
    public DateTime? NgayXoa { get; set; }

    public int MaSanPham { get; set; }

    [ForeignKey(nameof(MaSanPham))]
    public SanPham SanPham { get; set; } = null!;
    }
}