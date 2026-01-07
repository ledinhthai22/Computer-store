using Backend.Data;
using Backend.DTO.Brand;
using Backend.Helper;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Services.Brand
{
    public class BrandService : IBrandService
    {
        private readonly ApplicationDbContext _dbContext;
        public BrandService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<BrandResult>> GetAllAsync()
        {
            return await _dbContext.ThuongHieu
                .Where(x => x.IsDeleted == null)
                .Select(b => new BrandResult
                {
                    BrandID = b.MaThuongHieu,
                    BrandName = b.TenThuongHieu,
                    IsDeleted = b.IsDeleted
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<BrandResult>> GetAllHidenAsync()
        {
            return await _dbContext.ThuongHieu
                .Where(x => x.IsDeleted != null)
                .Select(b => new BrandResult
                {
                    BrandID = b.MaThuongHieu,
                    BrandName = b.TenThuongHieu,
                    IsDeleted = b.IsDeleted
                })
                .ToListAsync();
        }
        public async Task<BrandResult?> GetByIdAsync(int id)
        {
            return await _dbContext.ThuongHieu
                .Where(b => b.MaThuongHieu == id && b.IsDeleted == null)
                .Select(b => new BrandResult
                {
                    BrandID = b.MaThuongHieu,
                    BrandName = b.TenThuongHieu,
                    IsDeleted = b.IsDeleted
                })
                .FirstOrDefaultAsync();
        }
        public async Task<BrandResult> CreateAsync(CreateBrandRequest request)
        {
            string BrandName = request.BrandName.Trim();

            bool isDuplicate = await _dbContext.ThuongHieu.AnyAsync(x => x.TenThuongHieu == BrandName && x.IsDeleted == null);
            if (isDuplicate){
                throw new InvalidOperationException($"Thương hiệu '{BrandName}' đã tồn tại!");
            }
            var BrandNew = new ThuongHieu { TenThuongHieu = BrandName, IsDeleted = null };
             _dbContext.ThuongHieu.Add(BrandNew);
            bool created = await _dbContext.SaveChangesAsync() > 0;
            if (!created)
            {
                throw new InvalidOperationException("Tạo thương hiệu thất bại!");
            }
            return new BrandResult
            {
                BrandID = BrandNew.MaThuongHieu,
                BrandName = BrandNew.TenThuongHieu,
                IsDeleted = BrandNew.IsDeleted
            };
        }
        public async Task<BrandResult?> UpdateAsync(int id, UpdateBrandRequest request)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null || brand.IsDeleted == null) return null;
            string BrandName = request.BrandName.Trim();
            bool isDuplicate = await _dbContext.ThuongHieu
                .AnyAsync(x => x.TenThuongHieu == BrandName && x.MaThuongHieu != id && x.IsDeleted == null);
            if (isDuplicate)
                {
                throw new InvalidOperationException($"Thương hiệu '{BrandName}' đã tồn tại!");
            }
            brand.TenThuongHieu = BrandName;
            await _dbContext.SaveChangesAsync();
            return new BrandResult
            {
                BrandID = brand.MaThuongHieu,
                BrandName = brand.TenThuongHieu,
                IsDeleted = brand.IsDeleted
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null || brand.IsDeleted == null) return false;
            brand.IsDeleted = DateTime.Now;
            bool deleted = await _dbContext.SaveChangesAsync() > 0;
            if (!deleted)
            {
                throw new InvalidOperationException("Xóa thương hiệu thất bại!");
            }
            return true;
        }
        public async Task<bool> RestoreAsync(int id)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null || brand.IsDeleted == null)
            {
                return false;
            }
            brand.IsDeleted = null;
            bool restored = await _dbContext.SaveChangesAsync() > 0;
            if (!restored)
            {
                throw new InvalidOperationException("Khôi phục thương hiệu thất bại!");
            }
            return true;
        }
    }
}
