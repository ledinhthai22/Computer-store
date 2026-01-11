using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class DiaChiNhanHang
    {
        [Key]
        public int MaDiaChiNhanHang { get; set; }

        [Required]
        public string TenNguoiNhan { get; set; } = null!;

        [Required]
        [MaxLength(15)]
        public string SoDienThoai { get; set; } = null!;

        [Required]
        public string DiaChi { get; set; } = null!;

        [Required]
        public string PhuongXa  { get; set; } = null!;

        [Required]
        public string TinhThanh { get; set; } = null!;

        public bool DiaChiMacDinh { get; set; }

        public DateTime NgayXoa {get;set; }
        public int MaNguoiDung { get; set; }
        [ForeignKey(nameof(MaNguoiDung))]
        public NguoiDung NguoiDung { get; set; } = null!;
    }
}