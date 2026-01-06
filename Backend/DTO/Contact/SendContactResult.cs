using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Contact
{
    public class ContactResult
    {
        public int MaLienHe { get; set; }
        public string Email { get; set; } = null!;
        public string NoiDung { get; set; } = null!; 
        public DateTime NgayGui { get; set; } = DateTime.Now; 
        public int TrangThai { get; set; }
        public string Message {get;set;} = null!;
    }
}