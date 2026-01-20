using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.WishList
{
    public class WishlistResult 
    {
        public int MaYeuThich { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaSanPham { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public string HinhAnhChinh { get; set; } = string.Empty;
        public decimal? GiaBan { get; set; }
        public decimal? GiaKhuyenMai { get; set; }
    }
}
