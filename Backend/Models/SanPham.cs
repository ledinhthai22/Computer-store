using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class SanPham 
    {
        [Key]
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public float GiaCoBan { get; set; }
        public float DanhGiaTrungBinh { get; set; }
        public float KhuyenMai { get; set; }
        public int SoLuongTon { get; set; }
        public int LuotXem { get; set; } 
        public int LuotMua { get; set; }
        public DateTime NgayTao { get; set; }
        public bool TrangThai { get; set; } = true;

        //public int MaDanhMuc { get; set; }
        //[ForeignKey("MaDanhMuc")]
        //public ICollection<DanhMuc> DanhMuc { get; set; } = new List<DanhMuc>();
        //public int MaThuongHieu { get; set; }
        //[ForeignKey("MaThuongHieu")]
        //public ICollection<ThuongHieu> ThuongHieu { get; set; } = new List<ThuongHieu>();
        //public int MaThongSoKyThuat { get; set; }
        //[ForeignKey("MaThongSoKyThuat")]
        //public ICollection<ThongSoKyThuat> ThongSoKyThuat { get; set; } = new List<ThongSoKyThuat>();
        //public int MaDanhGia { set; get; }
        //[ForeignKey("MaDanhGia")]
        //public ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

    }
}
