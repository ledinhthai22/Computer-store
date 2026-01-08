using Backend.Data;
using Backend.DTO.WebInfo;
using Backend.Models;
using Ecommerce.DTO.WebInfo;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
namespace Backend.Services.WebInfo
{
    public class WebInfoService: IWebInfoService
    {
        private readonly ApplicationDbContext _DbContext;
        public WebInfoService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }
        public async Task<WebInfoResult> GetAsync()
        {
            var webInfo = await _DbContext.ThongTinTrang
                .Where(t => t.IsDelete == null)
                .FirstOrDefaultAsync();
            if (webInfo == null)
            {
                return null;
            }
            var result = new WebInfoResult
            {
                MaThongTinTrang = webInfo.MaThongTin,
                TenTrang = webInfo.TenTrang,
                DiaChi = webInfo.DiaChi,
                SoDienThoai = webInfo.SoDienThoai,
                DuongDanFacebook = webInfo.DuongDanFacebook,
                DuongDanInstagram = webInfo.DuongDanInstagram,
                DuongDanYoutube = webInfo.DuongDanYoutube,
                ChinhSachBaoMat = webInfo.ChinhSachBaoMat,
                ChinhSachDoiTra = webInfo.ChinhSachDoiTra,
                DieuKhoanSuDung = webInfo.DieuKhoanSuDung,
                DuongDanAnh = webInfo.DuongDanAn
            };
            return result;
        }
        
        public async Task<List<WebInfoResult>> GetAllHidenAsync()
        {
            var webInfo = await _DbContext.ThongTinTrang
                .Where(t => t.IsDelete != null)
                .Select(t=> new WebInfoResult
                {
                    MaThongTinTrang = t.MaThongTin,
                    TenTrang = t.TenTrang,
                    DiaChi = t.DiaChi,
                    SoDienThoai = t.SoDienThoai,
                    DuongDanFacebook = t.DuongDanFacebook,
                    DuongDanInstagram = t.DuongDanInstagram,
                    DuongDanYoutube = t.DuongDanYoutube,
                    ChinhSachBaoMat = t.ChinhSachBaoMat,
                    ChinhSachDoiTra = t.ChinhSachDoiTra,
                    DieuKhoanSuDung = t.DieuKhoanSuDung,
                    DuongDanAnh = t.DuongDanAn
                })
                .ToListAsync();
            if (webInfo == null)
            {
                return null;
            }
            return webInfo;
        }
        public async Task<bool> SoftDelete(int id)
        {
            var webInfo = await _DbContext.ThongTinTrang.FindAsync(id);
            if (webInfo == null || webInfo.IsDelete != null)
            {
                return false;
            }
            webInfo.IsDelete = DateTime.Now;
            _DbContext.ThongTinTrang.Update(webInfo);
            return await _DbContext.SaveChangesAsync() > 0;
        }
        public async Task<WebInfoResult> CreateWebInfo(WebInfoItemRequest request)
        {
            var WebInfo = new ThongTinTrang
            {
                TenTrang = request.TenTrang,
                SoDienThoai = request.SoDienThoai,
                DiaChi = request.DiaChi,
                DuongDanFacebook = request.DuongDanFacebook,
                DuongDanInstagram = request.DuongDanInstagram,
                DuongDanYoutube = request.DuongDanYoutube,
                ChinhSachBaoMat = request.ChinhSachBaoMat,
                ChinhSachDoiTra = request.ChinhSachDoiTra,
                DieuKhoanSuDung = request.DieuKhoanSuDung,
                DuongDanAn = request.DuongDanAnh
            };
            _DbContext.ThongTinTrang.Add(WebInfo);
            bool result = await _DbContext.SaveChangesAsync() > 0;
            if (!result)
            {
                throw new InvalidOperationException("Thêm thông tin trang thất bại!");
            }
            return new WebInfoResult
            {
                MaThongTinTrang = WebInfo.MaThongTin,
                TenTrang = WebInfo.TenTrang,
                SoDienThoai = WebInfo.SoDienThoai,
                DiaChi = WebInfo.DiaChi,
                DuongDanFacebook = WebInfo.DuongDanFacebook,
                DuongDanInstagram = WebInfo.DuongDanInstagram,
                DuongDanYoutube = WebInfo.DuongDanYoutube,
                ChinhSachBaoMat = WebInfo.ChinhSachBaoMat,
                ChinhSachDoiTra = WebInfo.ChinhSachDoiTra,
                DieuKhoanSuDung = WebInfo.DieuKhoanSuDung,
                DuongDanAnh = WebInfo.DuongDanAn
            };
        }
        public async Task<WebInfoResult> UpdateWebInfo(int id,WebInfoItemRequest request)
        {
            var WebInfo = await _DbContext.ThongTinTrang.FindAsync(id);
            if (WebInfo == null || WebInfo.IsDelete != null) return null;
            WebInfo.TenTrang = request.TenTrang;
            WebInfo.SoDienThoai = request.SoDienThoai;
            WebInfo.DiaChi = request.DiaChi;
            WebInfo.DuongDanFacebook = request.DuongDanFacebook;
            WebInfo.DuongDanInstagram = request.DuongDanInstagram;
            WebInfo.DuongDanYoutube = request.DuongDanYoutube;
            WebInfo.ChinhSachBaoMat = request.ChinhSachBaoMat;
            WebInfo.ChinhSachDoiTra = request.ChinhSachDoiTra;
            WebInfo.DieuKhoanSuDung = request.DieuKhoanSuDung;
            WebInfo.DuongDanAn = request.DuongDanAnh;
            bool result = await _DbContext.SaveChangesAsync()>0;
            if (!result) { throw new InvalidOperationException($"Cập nhật thông tin trang không thành công!"); }
            return new WebInfoResult
            {
                MaThongTinTrang = WebInfo.MaThongTin,
                TenTrang = WebInfo.TenTrang,
                SoDienThoai = WebInfo.SoDienThoai,
                DiaChi = WebInfo.DiaChi,
                DuongDanFacebook = WebInfo.DuongDanFacebook,
                DuongDanInstagram = WebInfo.DuongDanInstagram,
                DuongDanYoutube = WebInfo.DuongDanYoutube,
                ChinhSachBaoMat = WebInfo.ChinhSachBaoMat,
                ChinhSachDoiTra = WebInfo.ChinhSachDoiTra,
                DieuKhoanSuDung = WebInfo.DieuKhoanSuDung,
                DuongDanAnh = WebInfo.DuongDanAn
            };
        }
        public async Task<bool> RestoreWebInfo(int id)
        {
            var webInfo = await _DbContext.ThongTinTrang.FindAsync(id);
            if (webInfo == null || webInfo.IsDelete == null)
            {
                return false;
            }
            var WebInfoOnl = await GetAsync();
            if(WebInfoOnl != null)  await SoftDelete(WebInfoOnl.MaThongTinTrang);
            webInfo.IsDelete = null;
            _DbContext.ThongTinTrang.Update(webInfo);
            return await _DbContext.SaveChangesAsync() > 0;
        }
    }
}
