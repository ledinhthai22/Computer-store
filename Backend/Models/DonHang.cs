using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class DonHang
    {
        [Key]
        public int MaDH { get; set; }

        public string MaDon { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienGoc { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienThanhToan { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienGiam { get; set; }

        public int PhuongThucThanhToan { get; set; }
        public int TrangThai { get; set; }

        // FK NguoiDung
        public int MaKH { get; set; }
        [ForeignKey(nameof(MaKH))]
        public virtual NguoiDung KhachHang { get; set; } = null!;

        // FK DiaChiNhanHang
        public int MaDiaChiNhanHang { get; set; }
        [ForeignKey(nameof(MaDiaChiNhanHang))]
        public virtual DiaChiNhanHang DiaChiNhanHang { get; set; } = null!;

        // FK BienThe (Sản phẩm trong đơn)
        public int MaBienThe { get; set; }
        [ForeignKey(nameof(MaBienThe))]
        public virtual BienThe BienThe { get; set; } = null!;
    }
}