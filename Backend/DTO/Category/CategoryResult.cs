using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Category
{
    public class CategoryResult
    {
        public int MaDanhMuc { get; set; }
        public string TenDanhMuc { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public bool TrangThai { get; set; }
    }
}