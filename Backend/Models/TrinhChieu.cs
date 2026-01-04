using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class TrinhChieu
    {
        public int maTrinhChieu { get; set; }
        public string duongDanHinh { get; set; } = null!;
        public string duongDanSanPham { get; set; } = null!;
        public int soThuTu { get; set; }
        public bool trangThai { get; set; } = true;
    }
}