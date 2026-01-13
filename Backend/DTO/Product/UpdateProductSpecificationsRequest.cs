using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Product
{
    public class UpdateProductSpecificationsRequest
    {
        [MaxLength(50)]
        public string KichThuocManHinh { get; set; } = null!;

        [MaxLength(50)]
        public string SoKheRam { get; set; } = null!;

        [MaxLength(100)]
        public string OCung { get; set; }= null!;

        [MaxLength(50)]
        public string Pin { get; set; }= null!;

        [MaxLength(100)]
        public string HeDieuHanh { get; set; }= null!;

        [MaxLength(50)]
        public string DoPhanGiaiManHinh { get; set; }= null!;

        [MaxLength(100)]
        public string LoaiXuLyTrungTam { get; set; }= null!;

        [MaxLength(100)]
        public string LoaiXuLyDoHoa { get; set; }= null!;

        [MaxLength(255)]
        public string CongGiaoTiep { get; set; }= null!;
    }
}