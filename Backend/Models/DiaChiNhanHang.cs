using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class DiaChiNhanHang
    {
        public int maDiaChiNhanHang { get; set; }
        public int maNguoiDung { get; set; }
        public string tenNguoiNhan { get; set; } = null!;
        public string soDienThoai { get; set; } = null!;
        public string diaChi { get; set; } = null!;
        public string thuong { get; set; } = null!;
        public string tinh { get; set; } = null!;
        public bool diaChiMacDinh { get; set; } 
        // public NguoiDung Nguoidung { get; set; } = null!;
    }
}