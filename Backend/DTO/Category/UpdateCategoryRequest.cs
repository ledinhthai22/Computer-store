using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Category
{
    public class UpdateCategoryRequest
    {
        
        [Required]
        public string TenDanhMuc {get;set;} =null!;
        public bool TrangThai {get;set;} = true;
    }
}