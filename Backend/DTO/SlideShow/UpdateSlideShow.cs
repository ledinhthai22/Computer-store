namespace Ecommerce.DTO.SlideShow
{
    public class UpdateSlideShow
    {
        public IFormFile? HinhAnh { get; set; }

        public string? TenSlideShow { get; set; }

        public string DuongDanSanPham { get; set; } = null!;

        public int SoThuTu { get; set; }

        public bool TrangThai { get; set; }
    }
}
