using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class ChiTietGioHang 
    {
        public int SoLuong { get; set; }

        //public int MaSanPham { set; get; }
        //[ForeignKey("MaSanPham")]
        //public ICollection<SanPham> SanPham { get; set; } = new List<SanPham>();

        //public int MaBienThe { set; get; }
        //[ForeignKey("MaBienThe")]
        //public ICollection<BienThe> BienThe { get; set; } = new List<BienThe>();
    }
}
