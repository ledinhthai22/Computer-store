using Backend.Models;

namespace Ecommerce.Models
{
    public class VaiTro
    {
        public int maVaiTro { get; set; }
        public string? tenVaiTro { get; set; }
        public ICollection<NguoiDung> Nguoidung { get; set; } = new List<NguoiDung>();
    }
}
