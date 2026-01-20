using Backend.Data;
using Backend.Models;
using Ecommerce.DTO.SlideShow;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Ecommerce.Services.SlideShow
{
    public class SlideShowService : ISlideShowService
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly IWebHostEnvironment _Env;
        public SlideShowService(ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            _DbContext = dbContext;
            _Env = env;
        }
        public async Task<List<SlideShowResult>> GetAllAsync()
        {
            return await _DbContext.TrinhChieu
               .Where(t => t.NgayXoa == null && t.TrangThai == true)
               .OrderBy(t => t.SoThuTu)
               .Select(t => new SlideShowResult
               {
                   MaTrinhChieu = t.MaTrinhChieu,
                   TenTrinhChieu = t.TenTrinhChieu,
                   DuongDanHinh = t.DuongDanHinh,
                   DuongDanSanPham = t.DuongDanSanPham,
                   SoThuTu = t.SoThuTu,
                   TrangThai = t.TrangThai
               }).ToListAsync();
        }
        public async Task<List<SlideShowResult>> GetAllAdminAsync()
        {
            return await _DbContext.TrinhChieu
                .Where(t => t.NgayXoa == null)
                .OrderByDescending(t => t.MaTrinhChieu)
                .Select(t => new SlideShowResult
                {
                    MaTrinhChieu = t.MaTrinhChieu,
                    DuongDanHinh = t.DuongDanHinh,
                    DuongDanSanPham = t.DuongDanSanPham,
                    SoThuTu = t.SoThuTu,
                    TrangThai = t.TrangThai
                }).ToListAsync();
        }
        public async Task<SlideShowResult?> GetByIdAsync(int id)
        {
            var slideShow = await _DbContext.TrinhChieu.FindAsync(id);
            if (slideShow == null)
                return null;
            return new SlideShowResult
            {
                MaTrinhChieu = slideShow.MaTrinhChieu,
                TenTrinhChieu = slideShow.TenTrinhChieu,
                DuongDanHinh = slideShow.DuongDanHinh,
                DuongDanSanPham = slideShow.DuongDanSanPham,
                SoThuTu = slideShow.SoThuTu,
                TrangThai = slideShow.TrangThai
            };

        }
        public async Task<bool> CreateAsync(SlideShowCreate request)
        {
            var fileName = $"{DateTime.Now:dd-MM-yy}-{request.TenTrinhChieu}{Path.GetExtension(request.HinhAnh.FileName)}";
            var FolderPath = Path.Combine(_Env.WebRootPath, "SlideShow", "Image");
            Directory.CreateDirectory(FolderPath);
            var filePath = Path.Combine(FolderPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await request.HinhAnh.CopyToAsync(stream);
            var slideShow = new TrinhChieu
            {
                DuongDanHinh = $"/SlideShow/Image/{fileName}",
                DuongDanSanPham = request.DuongDanSanPham,
                SoThuTu = request.SoThuTu,
                TrangThai = request.TrangThai
            };
            _DbContext.TrinhChieu.Add(slideShow);
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateAsync(int id, UpdateSlideShow request)
        {
            var slideShow = await _DbContext.TrinhChieu.FindAsync(id);
            if (slideShow == null)
                return false;
            if (request.HinhAnh != null)
            {
                var fileName = $"{DateTime.Now:dd-MM-yy}-{request.TenTrinhChieu}{Path.GetExtension(request.HinhAnh.FileName)}";
                var FolderPath = Path.Combine(_Env.WebRootPath, "SlideShow", "Image");
                Directory.CreateDirectory(FolderPath);
                var filePath = Path.Combine(FolderPath, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await request.HinhAnh.CopyToAsync(stream);
                slideShow.DuongDanHinh = $"/SlideShow/Image/{fileName}";
            }
            slideShow.DuongDanSanPham =  request.DuongDanSanPham;
            slideShow.SoThuTu = request.SoThuTu;
            slideShow.TrangThai = request.TrangThai;
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var slideShow = await _DbContext.TrinhChieu.FindAsync(id);
            if (slideShow == null) return false;

            slideShow.NgayXoa = DateAndTime.Now;
            await _DbContext.SaveChangesAsync();
            return true;
        }
    }
}
