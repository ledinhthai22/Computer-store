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

        // FK SanPham
        public int MaSanPham { get; set; }
        [ForeignKey(nameof(MaSanPham))]
        public SanPham? SanPham { get; set; }

        // FK NguoiDung
        public int MaNguoiDung { get; set; } // Thêm field ID rõ ràng
        [ForeignKey(nameof(MaNguoiDung))]
        public NguoiDung? NguoiDung { get; set; }
    }
}