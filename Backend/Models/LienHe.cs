using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class LienHe
    {
        public int maLienHe { get; set; }
        public string email { get; set; } = null!;
        public DateTime noiDung { get; set; }
        public bool trangThai { get; set; } = true;
    }
}