using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class CreateProductVariantRequest
    {
        [Required(ErrorMessage = "Tên biến thể không được để trống")]
        [MaxLength(255)]
        public string TenBienThe { get; set; } = null!;

        [Required(ErrorMessage = "Giá bán không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá bán phải lớn hơn hoặc bằng 0")]
        public decimal GiaBan { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá khuyến mãi phải lớn hơn hoặc bằng 0")]
        public decimal? GiaKhuyenMai { get; set; } 

        [Required(ErrorMessage = "Màu sắc không được để trống")]
        public string MauSac { get; set; } = null!;

        [Required(ErrorMessage = "RAM không được để trống")]
        public string Ram { get; set; } = null!;

        [Required(ErrorMessage = "Ổ cứng không được để trống")]
        public string OCung { get; set; } = null!;

        [Required(ErrorMessage = "Bộ xử lý trung tâm không được để trống")]
        public string BoXuLyTrungTam { get; set; } = null!;
        public string? BoXuLyDoHoa { get; set; } = null!;

        [Required(ErrorMessage = "Số lượng tồn không được để trống")]
        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn phải lớn hơn hoặc bằng 0")]
        public int SoLuongTon { get; set; }

        [Required(ErrorMessage = "Thông số kỹ thuật không được để trống")]
        public CreateProductSpecificationsRequest ThongSoKyThuat { get; set; } = null!;
    }
}