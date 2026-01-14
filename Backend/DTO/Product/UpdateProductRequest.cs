using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class UpdateProductRequest
    {
        [MaxLength(255, ErrorMessage = "Tên sản phẩm không được quá 255 ký tự")]
        public string? TenSanPham { get; set; }

        public int? MaDanhMuc { get; set; }

        public int? MaThuongHieu { get; set; }
        public int SoLuongTon { get; set; }
        public List<IFormFile>? HinhAnhMoi { get; set; }

        public List<int>? HinhAnhXoa { get; set; }

        public List<UpdateProductVariantRequest>? BienThe { get; set; }

        public List<int>? BienTheXoa { get; set; }
    }
}