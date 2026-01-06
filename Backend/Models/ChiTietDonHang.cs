using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Ecommerce.Models
{
    public class ChiTietDonHang 
    {
        [Key]
        public int MaCTDH { get; set; }
        public int MaDonHang { get; set; }
        public int MaBienThe { get; set; }
        public int SoLuong { get; set; }

        [ForeignKey(nameof(MaDonHang))]
        public virtual DonHang DonHang { get; set; } = null!;
        [ForeignKey(nameof(MaBienThe))]
        public virtual BienThe BienThe { get; set; } = null!;
    }
}
