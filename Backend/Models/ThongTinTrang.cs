using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class ThongTinTrang
    {
        public int MaThongTin { get; set; }
        public string TenTrang { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string DiaChi { get; set; } = null!;
        public string FaceBookUrl { get; set; } = null!;
        public string InstagramUrl { get; set; } = null!;
        public string YoutubeUrl { get; set; } = null!;
        public string ChinhSachBaoMat { get; set; } = null!;
        public string ChinhSachDoiTra { get; set; } = null!;
        public string DieuKhoanSuDung { get; set; } = null!;
        public string LogoUrl { get; set; } = null!;
        public bool TrangThai { get; set; } = true ;
    }
}