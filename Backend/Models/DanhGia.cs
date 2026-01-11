using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Ecommerce.Models
{
    public class DanhGia
    {
        [Key]
        public int MaDanhGia { get; set; }

        public int SoSao { get; set; }
        public string NoiDung { get; set; } = null!;
        public DateTime NgayDanhGia { get; set; } = DateTime.Now;

        public bool TrangThai { get; set; } = true;
        public DateTime? NgayXoa { get; set; }
        public int MaSanPham { get; set; }
        [ForeignKey(nameof(MaSanPham))]
        public SanPham? SanPham { get; set; }

        public int MaNguoiDung { get; set; } 
        [ForeignKey(nameof(MaNguoiDung))]
        public NguoiDung? NguoiDung { get; set; }
    }
}