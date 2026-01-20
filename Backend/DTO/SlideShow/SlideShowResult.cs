namespace Ecommerce.DTO.SlideShow
{
    public class SlideShowResult
    {
        public int MaTrinhChieu { get; set; }
        public string DuongDanHinh { get; set; } = null!;
        public string DuongDanSanPham { get; set; } = null!;
        public int SoThuTu { get; set; }
        public bool TrangThai { get; set; }
    }
}
