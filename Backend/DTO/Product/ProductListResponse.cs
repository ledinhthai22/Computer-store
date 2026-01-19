using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductListResponse
    {
        public List<ProductListItem> DanhSach { get; set; } = new();
        public int TongSoSanPham { get; set; }
        public int TongSoTrang { get; set; }
        public int TrangHienTai { get; set; }
        public int SoLuongMoiTrang { get; set; }
    }
}