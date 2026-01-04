using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce.Models;

namespace Backend.Models
{
    public class NguoiDung
    {
        public int maNguoiDung { get; set; }
        public int maVaiTro { get; set; }

        public string hoTen { get; set; } = null!;
        public string tenTaiKhoan { get; set; } = null!;
        public string matKhauMaHoa { get; set; } = null!;
        public string email { get; set; } = null!;
        public string soDienThoai { get; set; } = null!;
        public DateTime? ngaySinh { get; set; }

        public bool trangThai { get; set; }
        public DateTime ngayTao { get; set; }
        public DateTime ngayCapNhat { get; set; }
        public VaiTro Vaitro { get; set; } = null!;
        // public ICollection<DiaChiNhanHang> Diachinhanhang { get; set; } = new List<DiaChiNhanHang>();
        // public ICollection<DonHang> Donhang { get; set; } = new List<DonHang>();
        // public ICollection<DanhGia> Danhgia { get; set; } = new List<DanhGia>();
    }
}