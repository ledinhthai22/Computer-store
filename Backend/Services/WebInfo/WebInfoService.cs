using Backend.Data;
using Backend.DTO.WebInfo;
using Backend.Models;
using Ecommerce.DTO.WebInfo;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.WebInfo
{
    public class WebInfoService : IWebInfoService
    {
        private readonly ApplicationDbContext _DbContext;

        public WebInfoService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }

        public async Task<Dictionary<string, string?>> GetForClientAsync()
        {
            return await _DbContext.ThongTinTrang
                .Where(x => x.NgayXoa == null && x.TrangThai == true)
                .ToDictionaryAsync(
                    x => x.TenKhoaCaiDat,
                    x => x.TomTat
                );
        }
        public async Task<List<WebInfoResult>> GetAllAsync()
        {
            return await _DbContext.ThongTinTrang
                .OrderByDescending(x => x.NgayCapNhat)
                .Select(x => new WebInfoResult
                {
                    MaThongTinTrang = x.MaThongTinTrang,
                    TenKhoaCaiDat = x.TenKhoaCaiDat,
                    GiaTriCaiDat = x.GiaTriCaiDat,
                    TomTat = x.TomTat,
                    MoTa = x.MoTa,
                    TrangThaiHienThi = x.TrangThai,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa
                })
                .ToListAsync();
        }


        public async Task<List<WebInfoResult>> GetForAdminAsync()
        {
            return await _DbContext.ThongTinTrang
                .Where(x => x.NgayXoa == null)
                .OrderByDescending(x => x.NgayCapNhat)
                .Select(x => new WebInfoResult
                {
                    MaThongTinTrang = x.MaThongTinTrang,
                    TenKhoaCaiDat = x.TenKhoaCaiDat,
                    GiaTriCaiDat = x.GiaTriCaiDat,
                    MoTa = x.MoTa,
                    TrangThaiHienThi = x.TrangThai,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa
                })
                .ToListAsync();
        }

        public async Task<List<WebInfoResult>> GetDeletedAsync()
        {
            return await _DbContext.ThongTinTrang
                .Where(x => x.NgayXoa != null)
                .OrderByDescending(x => x.NgayXoa)
                .Select(x => new WebInfoResult
                {
                    MaThongTinTrang = x.MaThongTinTrang,
                    TenKhoaCaiDat = x.TenKhoaCaiDat,
                    GiaTriCaiDat = x.GiaTriCaiDat,
                    MoTa = x.MoTa,
                    TrangThaiHienThi = x.TrangThai,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa
                })
                .ToListAsync();
        }

        public async Task CreateAsync(WebInfoCreate request)
        {
            var exists = await _DbContext.ThongTinTrang
                .AnyAsync(x => x.TenKhoaCaiDat == request.TenKhoaCaiDat && x.NgayXoa == null);

            if (exists)
                throw new Exception("Khóa cài đặt đã tồn tại");

            var entity = new ThongTinTrang
            {
                TenKhoaCaiDat = request.TenKhoaCaiDat,
                GiaTriCaiDat = request.GiaTriCaiDat,
                MoTa = request.MoTa,
                TomTat = request.TomTat,
                TrangThai = true,
                NgayCapNhat = DateTime.Now
            };

            _DbContext.ThongTinTrang.Add(entity);
            await _DbContext.SaveChangesAsync();
        }

        public async Task<WebInfoResult?> UpdateAsync(int id, WebInfoUpdate request)
        {
            var entity = await _DbContext.ThongTinTrang
                .FirstOrDefaultAsync(x => x.MaThongTinTrang == id && x.NgayXoa == null);

            if (entity == null)
                return null;

            entity.GiaTriCaiDat = request.GiaTriCaiDat;
            entity.MoTa = request.MoTa;
            entity.TrangThai = request.TrangThaiHienThi;
            entity.NgayCapNhat = DateTime.Now;

            await _DbContext.SaveChangesAsync();

            return new WebInfoResult
            {
                MaThongTinTrang = entity.MaThongTinTrang,
                TenKhoaCaiDat = entity.TenKhoaCaiDat,
                GiaTriCaiDat = entity.GiaTriCaiDat,
                TomTat = entity.TomTat,
                MoTa = entity.MoTa,
                TrangThaiHienThi = entity.TrangThai,
                NgayCapNhat = entity.NgayCapNhat,
                NgayXoa = entity.NgayXoa
            };
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _DbContext.ThongTinTrang
                .FirstOrDefaultAsync(x => x.MaThongTinTrang == id && x.NgayXoa == null);

            if (entity == null)
                throw new Exception("Cấu hình không tồn tại");

            if (entity.TrangThai == true)
                throw new Exception("Cấu hình đang được sử dụng, không thể xóa");

            entity.NgayXoa = DateTime.Now;
            await _DbContext.SaveChangesAsync();
        }

        public async Task RestoreAsync(int id)
        {
            var entity = await _DbContext.ThongTinTrang.FindAsync(id);
            if (entity == null)
                throw new Exception("Cấu hình không tồn tại");

            var existsActive = await _DbContext.ThongTinTrang.AnyAsync(x =>
                x.TenKhoaCaiDat == entity.TenKhoaCaiDat &&
                x.NgayXoa == null &&
                x.MaThongTinTrang != id
            );

            if (existsActive)
                throw new Exception("Đã tồn tại cấu hình cùng khóa đang hoạt động");

            entity.NgayXoa = null;
            entity.NgayCapNhat = DateTime.Now;

            await _DbContext.SaveChangesAsync();
        }
    }
}
