using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class LienHe
    {
        [Key]
        public int MaLienHe { get; set; }
        public string Email { get; set; } = null!;
        public string NoiDung { get; set; } = null!; 
        public DateTime NgayGui { get; set; } = DateTime.Now; 
        public DateTime? Delete_At {get;set;}
        public bool TrangThai { get; set; } = true;
    }
}