using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ThongTinTrang
    {
        [Key]
        public int MaThongTin { get; set; }
        public string TenTrang { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string DiaChi { get; set; } = null!;
        public string DuongDanFacebook { get; set; } = null!;
        public string DuongDanInstagram { get; set; } = null!;
        public string DuongDanYoutube { get; set; } = null!;
        public string ChinhSachBaoMat { get; set; } = null!;
        public string ChinhSachDoiTra { get; set; } = null!;
        public string DieuKhoanSuDung { get; set; } = null!;
        public string DuongDanAn { get; set; } = null!;
        public DateTime? IsDelete { get; set; } 
    }
}