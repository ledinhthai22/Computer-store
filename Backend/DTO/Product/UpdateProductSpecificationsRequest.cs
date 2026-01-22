using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class UpdateProductSpecificationsRequest
    {
        [MaxLength(100)]
        public string? KichThuocManHinh { get; set; }
        [MaxLength(100)]
        public string? DungLuongRam { get; set; } 

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