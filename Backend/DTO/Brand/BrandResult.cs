using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Brand
{
    public class BrandResult
    {
        public int MaThuongHieu { get; set; }
        public string TenThuongHieu { get; set; } = null!;
        public DateTime? NgayXoa { get; set; } 
    }
}
