using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class AdminProductFilterRequest
    {
        public string? TuKhoa { get; set; }
        public int? MaDanhMuc { get; set; }
        public int? MaThuongHieu { get; set; }
        public bool? TrangThai { get; set; }
        public bool BaoGomDaXoa { get; set; } = false;
        public string SapXep { get; set; } = "moi-nhat";
        public int TrangHienTai { get; set; } = 1;
        public int SoLuongMoiTrang { get; set; } = 20;
    }
}