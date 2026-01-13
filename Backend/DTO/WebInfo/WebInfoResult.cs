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
        public string ? TenTrang { get; set; }
        public string ? SoDienThoai { get; set; }
        public string ? DiaChi { get; set; } 
        public string ? DuongDanFacebook { get; set; }
        public string ? DuongDanInstagram { get; set; } 
        public string ? DuongDanYoutube { get; set; } 
        public string ?ChinhSachBaoMat { get; set; }
        public string ?ChinhSachDoiTra { get; set; } 
        public string ?DieuKhoanSuDung { get; set; } 
        public string ?DuongDanAnh { get; set; } 
        public bool TrangThai { get; set; }
    }
}
