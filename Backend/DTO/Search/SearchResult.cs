using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;
using Ecommerce.Models;

namespace Backend.DTO.Search
{
    public class SearchAdminResult
    {
        public int MaSanPham { get; set; }

        [Required]
        [MaxLength(255)]
        public string TenSanPham { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Slug { get; set; } = null!;
        public double DanhGiaTrungBinh { get; set; }
        public int SoLuongTon { get; set; }
        public int LuotXem { get; set; }
        public int LuotMua { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayXoa { get; set; }
        public string? TenDanhMuc { get; set; }
        public string TenThuongHieu { get; set; }
        public ICollection<ProductVariant> BienThe { get; set; } = new List<ProductVariant>();
        public ICollection<HinhAnhSanPham> HinhAnhSanPham { get; set; } = new List<HinhAnhSanPham>();
    }
    public class SearchUserResult
    {
        public int MaSanPham { get; set; }

        [Required]
        [MaxLength(255)]
        public string TenSanPham { get; set; } = null!;
        public double DanhGiaTrungBinh { get; set; }
        public int SoLuongTon { get; set; }
        public int LuotXem { get; set; }
        public int LuotMua { get; set; }
        public DateTime NgayTao { get; set; }
        public string? TenDanhMuc { get; set; }
        public string TenThuongHieu { get; set; }
        public ICollection<ProductVariant> BienThe { get; set; } = new List<ProductVariant>();
        public ICollection<HinhAnhSanPham> HinhAnhSanPham { get; set; } = new List<HinhAnhSanPham>();
    }
    public class ProductVariant
    {
        public int MaBTSP { get; set; }
        public string TenBienThe { get; set; } = null!;
        public decimal GiaBan { get; set; }
        public decimal GiaKhuyenMai { get; set; }
        public string MauSac { get; set; } = null!;
        public string Ram { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string BoXuLyTrungTam { get; set; } = null!;
        public string BoXuLyDoHoa { get; set; } = null!;
        public int SoLuongTon { get; set; }
        public bool TrangThai { get; set; }
    }
    public class SearchResult<T>
    {
        public string TuKhoa { get; set; }
        public List<T> KetQua { get; set; }
        public int? Tong { get; set; }
        public int? Trang { get; set; }
        public int? GioiHan { get; set; }
    }
}
