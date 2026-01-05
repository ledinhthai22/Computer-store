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
        public string BrandName { get; set; } = null!;
    }
}
