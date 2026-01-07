using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce.Models;

namespace Backend.Models
{
    public class NguoiDung
    {
        [Key]
        public int MaNguoiDung { get; set; }
        [Required]
        public string HoTen { get; set; } = null!;
        [Required]
        public string MatKhauMaHoa { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public bool TrangThai { get; set; }
        public DateTime? Delete_At {get;set;}
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; }
        public int MaVaiTro { get; set; }
        [ForeignKey(nameof(MaVaiTro))]
        public VaiTro VaiTro { get; set; } = null!;
        public ICollection<DiaChiNhanHang> DiaChiNhanHang { get; set; } = new List<DiaChiNhanHang>();
        public ICollection<YeuThich> YeuThich { get; set; } = new List<YeuThich>();
        public ICollection<ChiTietGioHang> ChiTietGioHang { get; set; } = new List<ChiTietGioHang>();
        public ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();
        public ICollection<DonHang> DonHang { get; set; } = new List<DonHang>(); 
    }
}