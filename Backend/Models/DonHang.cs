using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;
using Ecommerce.Models;
namespace Backend.Models
{
    public class DonHang
    {
        [Key]
        public int MaDH { get; set; }

        public string MaDon { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienThanhToan { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienGoc { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public int TrangThai { get; set; }

        public int MaKH { get; set; }
        [ForeignKey(nameof(MaKH))]
        public virtual NguoiDung KhachHang { get; set; } = null!;


        public int MaDiaChiNhanHang { get; set; }
        [ForeignKey(nameof(MaDiaChiNhanHang))]
        public virtual DiaChiNhanHang DiaChiNhanHang { get; set; } = null!;
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public ICollection<ChiTietDonHang> ChiTietDonHang { get; set; } = new List<ChiTietDonHang>();
        public string GhiChu { get; set; } = string.Empty;
        public string GhiChuNoiBo { get; set; } = string.Empty;
        public string NguoiNhan { get; set; } = string.Empty;
        public string SoDienThoaiNguoiNhan { get; set; } = string.Empty;
        public string TinhThanh { get; set; } = string.Empty;
        public string PhuongXa { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public DateTime? NgayXoa { get; set; }
    }
}