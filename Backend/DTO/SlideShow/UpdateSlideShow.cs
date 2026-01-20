namespace Ecommerce.DTO.SlideShow
{
    public class UpdateSlideShow
    {
        public IFormFile? HinhAnh { get; set; }
        public int MaTrinhChieu { get; set; }

        public string TenTrinhChieu { get; set; } = null!;

        public string DuongDanSanPham { get; set; } = null!;

        public int SoThuTu { get; set; }

        public bool TrangThai { get; set; }
    }
}
