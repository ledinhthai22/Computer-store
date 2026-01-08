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
                WebInfoId = webInfo.MaThongTin,
                WebName = webInfo.TenTrang,
                Address = webInfo.DiaChi,
                Phone = webInfo.SoDienThoai,
                LinkFacebook = webInfo.DuongDanFacebook,
                LinkInstagram = webInfo.DuongDanInstagram,
                LinkYoutube = webInfo.DuongDanYoutube,
                PrivacyPolicy = webInfo.ChinhSachBaoMat,
                ReturnPolicy = webInfo.ChinhSachDoiTra,
                Termsofuse = webInfo.DieuKhoanSuDung,
                LinkImage = webInfo.DuongDanAn
            };
            return result;
        }
        
        public async Task<List<WebInfoResult>> GetAllHidenAsync()
        {
            var webInfo = await _DbContext.ThongTinTrang
                .Where(t => t.IsDelete != null)
                .Select(t=> new WebInfoResult
                {
                    WebInfoId = t.MaThongTin,
                    WebName = t.TenTrang,
                    Address = t.DiaChi,
                    Phone = t.SoDienThoai,
                    LinkFacebook = t.DuongDanFacebook,
                    LinkInstagram = t.DuongDanInstagram,
                    LinkYoutube = t.DuongDanYoutube,
                    PrivacyPolicy = t.ChinhSachBaoMat,
                    ReturnPolicy = t.ChinhSachDoiTra,
                    Termsofuse = t.DieuKhoanSuDung,
                    LinkImage = t.DuongDanAn
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
                TenTrang = request.WebName,
                SoDienThoai = request.Phone,
                DiaChi = request.Address,
                DuongDanFacebook = request.LinkFacebook,
                DuongDanInstagram = request.LinkInstagram,
                DuongDanYoutube = request.LinkYoutube,
                ChinhSachBaoMat = request.PrivacyPolicy,
                ChinhSachDoiTra = request.ReturnPolicy,
                DieuKhoanSuDung = request.Termsofuse,
                DuongDanAn = request.LinkImage
            };
            _DbContext.ThongTinTrang.Add(WebInfo);
            bool result = await _DbContext.SaveChangesAsync() > 0;
            if (!result)
            {
                throw new InvalidOperationException("Thêm thông tin trang thất bại!");
            }
            return new WebInfoResult
            {
                WebInfoId = WebInfo.MaThongTin,
                WebName = WebInfo.TenTrang,
                Phone = WebInfo.SoDienThoai,
                Address = WebInfo.DiaChi,
                LinkFacebook = WebInfo.DuongDanFacebook,
                LinkInstagram = WebInfo.DuongDanInstagram,
                LinkYoutube = WebInfo.DuongDanYoutube,
                PrivacyPolicy = WebInfo.ChinhSachBaoMat,
                ReturnPolicy = WebInfo.ChinhSachDoiTra,
                Termsofuse = WebInfo.DieuKhoanSuDung,
                LinkImage = WebInfo.DuongDanAn
            };
        }
        public async Task<WebInfoResult> UpdateWebInfo(int id,WebInfoItemRequest request)
        {
            var WebInfo = await _DbContext.ThongTinTrang.FindAsync(id);
            if (WebInfo == null || WebInfo.IsDelete != null) return null;
            WebInfo.TenTrang = request.WebName;
            WebInfo.SoDienThoai = request.Phone;
            WebInfo.DiaChi = request.Address;
            WebInfo.DuongDanFacebook = request.LinkFacebook;
            WebInfo.DuongDanInstagram = request.LinkInstagram;
            WebInfo.DuongDanYoutube = request.LinkYoutube;
            WebInfo.ChinhSachBaoMat = request.PrivacyPolicy;
            WebInfo.ChinhSachDoiTra = request.ReturnPolicy;
            WebInfo.DieuKhoanSuDung = request.Termsofuse;
            WebInfo.DuongDanAn = request.LinkImage;
            bool result = await _DbContext.SaveChangesAsync()>0;
            if (!result) { throw new InvalidOperationException($"Cập nhật thông tin trang không thành công!"); }
            return new WebInfoResult
            {
                WebInfoId = WebInfo.MaThongTin,
                WebName = WebInfo.TenTrang,
                Phone = WebInfo.SoDienThoai,
                Address = WebInfo.DiaChi,
                LinkFacebook = WebInfo.DuongDanFacebook,
                LinkInstagram = WebInfo.DuongDanInstagram,
                LinkYoutube = WebInfo.DuongDanYoutube,
                PrivacyPolicy = WebInfo.ChinhSachBaoMat,
                ReturnPolicy = WebInfo.ChinhSachDoiTra,
                Termsofuse = WebInfo.DieuKhoanSuDung,
                LinkImage = WebInfo.DuongDanAn
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
            if(WebInfoOnl != null)  await SoftDelete(WebInfoOnl.WebInfoId);
            webInfo.IsDelete = null;
            _DbContext.ThongTinTrang.Update(webInfo);
            return await _DbContext.SaveChangesAsync() > 0;
        }
    }
}
