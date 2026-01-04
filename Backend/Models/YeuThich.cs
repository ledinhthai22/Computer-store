using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class YeuThich
    {
        [Key]
        public int MaYeuThich { set; get; }
        //public int MaNguoiDung { set; get; }
        //[ForeignKey("MaNguoiDung")]
        //public virtual NguoiDung NguoiDung { set; get; } = null!;
        //public int MaBienThe { set; get; }
        //[ForeignKey("MaBienThe")]
        //public virtual BienThe BienThe { set; get; } = null!;
    }
}
