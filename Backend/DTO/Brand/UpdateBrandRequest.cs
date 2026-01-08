using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Brand
{
    public class UpdateBrandRequest 
    {
       [Required]
       public string TenThuongHieu { get; set; } = null!;
       public DateTime NgayXoa { get; set; }
    }
}
