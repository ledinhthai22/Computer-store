using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class DanhGia
    {
        public int maDanhGia { get; set; }
        public int maSanPham { get; set; }
        public int maNguoiDung { get; set; }

        public int sao { get; set; }
        public string binhLuan { get; set; } = null!;
        public DateTime ngayDanhGia { get; set; }
        public int trangThai {get;set;} = 1; //duyệt 2 ẩn 3 xóa 0

        // public SanPham Sanpham { get; set; } = null!;
        // public NguoiDung Nguoidung { get; set; } = null!;
    }
}