using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Models
{
    public class DanhMuc
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string TenDanhMuc { get; set; } = null!;
        
        [Required]
        public string Slug { get; set; } = null!;
        
        public bool TrangThai {get;set;} = true;
        
        public ICollection<SanPham> SanPham { get; set; } = new List<SanPham>();
    }
}