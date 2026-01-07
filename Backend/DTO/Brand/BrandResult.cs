using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Brand
{
    public class BrandResult
    {
        public int BrandID { get; set; }
        public string BrandName { get; set; } = null!;
        public DateTime? IsDeleted { get; set; } 
    }
}
