using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class HinhAnhSanPham 
    {
        [Key]
        public int MaHinhAnh { get; set; }
        public string URL { get; set; } = null!;
        public bool AnhChinh { set; get; }
        public int ThuTuAnh { set; get; }

        //public int MaBienThe { set; get; }
        //[ForeignKey("MaBienThe")]
        //public ICollection<BienThe> BienThe { set;get; } = new List<BienThe>();
    }
}
