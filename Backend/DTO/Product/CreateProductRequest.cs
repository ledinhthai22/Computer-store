using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Product
{
    public class CreateProductRequest
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [MaxLength(255, ErrorMessage = "Tên sản phẩm không được quá 255 ký tự")]
        public string TenSanPham { get; set; } = null!;

        [Required(ErrorMessage = "Mã danh mục không được để trống")]
        public int MaDanhMuc { get; set; }

        [Required(ErrorMessage = "Mã thương hiệu không được để trống")]
        public int MaThuongHieu { get; set; }
        public int SoLuongTon { get; set; } 
        public List<IFormFile>? HinhAnh { get; set; }

        [Required(ErrorMessage = "Phải có ít nhất 1 biến thể")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 biến thể")]
        public List<CreateProductVariantRequest> BienThe { get; set; } = new();
    }
}
