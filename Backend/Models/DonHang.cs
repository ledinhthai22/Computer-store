using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Models
{
    public class DonHang    
    {
        [Key]
        public int MaDH { get; set; }
        public int MaKH { get; set; }
        public int MaDiaChiNhanHang { get; set; }
        public int MaBienThe { set; get; }
        public string MaDon { get; set; } = null!;
        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienGoc { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienThanhToan { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienGiam { get; set; }
        public int PhuongThucThanhToan { get; set; }
        public int TrangThai { get; set; }

        [ForeignKey("MaKH")]
        public virtual NguoiDung KhanhHang { get; set; } = null!;

        [ForeignKey("MaDiaChiNhanHang")]
        public virtual DiaChiNhanHang DiaChiNhanHang { set; get; } = null!;

        [ForeignKey("MaBienThe")]
        public virtual BienThe BienThe { get; set; } = null!;
    }
}
