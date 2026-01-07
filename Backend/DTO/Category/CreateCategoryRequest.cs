using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Category
{
    public class CreateCategoryRequest
    {
        [Required]
        public string TenDanhMuc {get;set;} =null!;
    }
}