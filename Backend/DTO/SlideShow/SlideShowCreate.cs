using System.ComponentModel.DataAnnotations;

namespace Ecommerce.DTO.SlideShow
{
    public class SlideShowCreate
    {
        [Required]
        public IFormFile HinhAnh { get; set; } = null!;

        [Required]
        public string TenTrinhChieu { get; set; } = null!;

        public string DuongDanSanPham { get; set; } = null!;

        public int SoThuTu { get; set; }

        public bool TrangThai { get; set; } = true;
    }
}
