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
        public DateTime? Is_Delete {get;set;}
        public bool TrangThai { get; set; } = true;
    }
}