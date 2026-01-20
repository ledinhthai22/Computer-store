using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Brand
{
    public class CreateBrandRequest
    {
        [Required]
        public string TenThuongHieu { get; set; } = null!;
        public bool TrangThai { get; set; }
    }
}
