using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Backend.Models
{
    // Cần setup Composite Key [MaNguoiDung, MaBienThe] trong DbContext
    public class ChiTietGioHang
    {
        public int MaNguoiDung { get; set; }
        [ForeignKey(nameof(MaNguoiDung))]
        public NguoiDung NguoiDung { get; set; } = null!;

        public int MaBienThe { get; set; }
        [ForeignKey(nameof(MaBienThe))]
        public BienThe BienThe { get; set; } = null!;

        public int SoLuong { get; set; }
    }
}