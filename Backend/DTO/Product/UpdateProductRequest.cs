using Backend.DTO.Product;

public class UpdateProductRequest
{
    public string? TenSanPham { get; set; }
    public int SoLuongTon { get; set; }
    public int? MaDanhMuc { get; set; }
    public int? MaThuongHieu { get; set; }

    public List<int>? HinhAnhXoa { get; set; }
    public List<IFormFile>? HinhAnhMoi { get; set; }

    // Thông tin ảnh chính
    public int? MaAnhChinh { get; set; } // ID của ảnh cũ nếu giữ ảnh cũ làm ảnh chính
    public bool AnhMoiDauTienLaAnhChinh { get; set; } // true nếu ảnh mới đầu tiên là ảnh chính

    public List<int>? BienTheXoa { get; set; }
    public List<UpdateProductVariantRequest>? BienThe { get; set; }
}

