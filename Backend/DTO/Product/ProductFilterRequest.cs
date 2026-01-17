using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductFilterRequest
    {
        public string? TuKhoa { get; set; }
        public int? MaDanhMuc { get; set; }
        public int? MaThuongHieu { get; set; }

        // Lọc theo giá
        public decimal? GiaMin { get; set; }
        public decimal? GiaMax { get; set; }

        // Lọc theo thông số kỹ thuật
        public string? Ram { get; set; }
        public string? OCung { get; set; }
        public string? MauSac { get; set; }
        public string? BoXuLyTrungTam { get; set; }
        public string? BoXuLyDoHoa { get; set; }
        public string? KichThuocManHinh { get; set; }

        // Sắp xếp
        public string SapXep { get; set; } = "moi-nhat";

        // Phân trang
        public int TrangHienTai { get; set; } = 1;
        public int SoLuongMoiTrang { get; set; } = 12;
    }
}