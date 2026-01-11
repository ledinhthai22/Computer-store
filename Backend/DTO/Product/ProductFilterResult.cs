namespace Ecommerce.DTO.Product
{
    public class ProductFilterResult
    {
        public int MaSanPham { get; set; }
        public string TenSanPham { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public decimal GiaTu { get; set; }
        public decimal GiaDen { get; set; }

        public string ThuongHieu { get; set; } = null!;
        public string DongChip { get; set; } = null!;
        public string DongCard { get; set; } = null!;
        public string KichThuocManHinh { get; set; } = null!;
        public string AnhChinh { get; set; } = null!;
    }
}
