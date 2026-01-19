using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Web;

namespace Backend.DTO.WebInfo
{
    public class WebInfoResult
    {
        public int MaThongTinTrang { get; set; }
        public string TenKhoaCaiDat { get; set; } = null!;
        public string? GiaTriCaiDat { get; set; }
        public string? MoTa { get; set; }
        public bool TrangThaiHienThi { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
        public string Message { get; set; } = null!;
    }
}
