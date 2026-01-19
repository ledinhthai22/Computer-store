using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Ecommerce.Models
{
    public class YeuThich
    {
        [Key]
        public int MaYeuThich { get; set; }
        public int MaNguoiDung { get; set; }
        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung NguoiDung { get; set; } = null!;
        public int MaSanPham { get; set; }
        [ForeignKey(nameof(MaSanPham))]
        public virtual SanPham SanPham { get; set; } = null!;
        public DateTime? NgayXoa { get; set; }
    }
}