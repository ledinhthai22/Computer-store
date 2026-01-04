using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class ThongSoKyThuat 
    {
        [Key]
        public string ID { get; set; } = null!;
        public string KichThuocManHinh { get; set; } = null!;
        public string SoKheRam { get; set; } = null!;
        public string OCung { get; set; } = null!;
        public string Pin { get; set; } = null!;
        public string HeDieuHanh { get; set; } = null!;
        public string DoPhanGiaiManHinh { get; set; } = null!;
    }
}
