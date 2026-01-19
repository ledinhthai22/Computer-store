using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class ProductSpecificationsResult
    {
        public string? KichThuocManHinh { get; set; }
        public string? DungLuongRam { get; set; }
        public string? SoKheRam { get; set; }
        public string? OCung { get; set; }
        public string? Pin { get; set; }
        public string? HeDieuHanh { get; set; }
        public string? DoPhanGiaiManHinh { get; set; }
        public string? LoaiXuLyTrungTam { get; set; }
        public string? LoaiXuLyDoHoa { get; set; }
        public string? CongGiaoTiep { get; set; }
    }
}