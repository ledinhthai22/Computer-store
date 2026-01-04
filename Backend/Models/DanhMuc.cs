using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class DanhMuc
    {
        public int maDanhMuc { get; set; }
        public string tenDanhMuc { get; set; } = null!;
        public string slug { get; set; } = null!;
        public bool trangThai { get; set; } = true;
        // public ICollection<SanPham> Sanpham { get; set; } = new List<SanPham>();
    }
}