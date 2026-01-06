using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Ecommerce.Models
{
    public class YeuThich
    {
        [Key]
        public int MaYeuThich { get; set; }
        public int MaNguoiDung { get; set; }
        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung NguoiDung { get; set; } = null!;
        public int MaBienThe { get; set; }
        [ForeignKey(nameof(MaBienThe))]
        public virtual BienThe BienThe { get; set; } = null!;
        public DateTime? Deleted_At { get; set; }
    }
}