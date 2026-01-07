using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductSpecificationsRequest
    {
        public string KichThuocManHinh { get; set; } = null!;
        public string SoKheRam { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string Pin { get; set; } = null!;
        public string HeDieuHanh { get; set; } = null!;
        public string DoPhanGiaiManHinh { get; set; } = null!;
        public string LoaiXuLyTrungTam { get; set; } = null!;
        public string LoaiXuLyDoHoa { get; set; } = null!;
        public string CongGiaoTiep { get; set; } = null!;
    }
}