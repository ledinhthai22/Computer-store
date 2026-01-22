using System.ComponentModel.DataAnnotations;

namespace Ecommerce.DTO.Product
{
    public class ProductSpecificationRequest
    {
        [MaxLength(100)]
        public string? KichThuocManHinh { get; set; }

        [MaxLength(100)]
        public string? SoKheRam { get; set; }

        [MaxLength(100)]
        public string? OCung { get; set; }

        [MaxLength(100)]
        public string? Pin { get; set; }

        [MaxLength(100)]
        public string? HeDieuHanh { get; set; }

        [MaxLength(100)]
        public string? DoPhanGiaiManHinh { get; set; }

        [MaxLength(100)]
        public string? LoaiXuLyTrungTam { get; set; }

        [MaxLength(100)]
        public string? LoaiXuLyDoHoa { get; set; }

        [MaxLength(255)]
        public string? CongGiaoTiep { get; set; }
    }
}
