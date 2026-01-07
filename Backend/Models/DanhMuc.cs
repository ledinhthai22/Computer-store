using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Models
{
    public class DanhMuc
    {
        [Key]
        public int MaDanhMuc { get; set; }
        
        [Required,MaxLength(100)]
        public string TenDanhMuc { get; set; } = null!;
        
        [Required]
        public string Slug { get; set; } = null!;
        public DateTime? Delete_At {get;set;}
        public bool TrangThai {get;set;} = true;
        
        public ICollection<SanPham> SanPham { get; set; } = new List<SanPham>();
    }
}