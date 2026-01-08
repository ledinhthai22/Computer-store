using Backend.Data;
using Backend.Helper;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Backend.DTO.Brand;

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
                .Where(x => x.TrangThai == true)
                .Select(b => new BrandResult
                {
                    BrandID = b.MaThuongHieu,
                    BrandName = b.TenThuongHieu,
                    Status = b.TrangThai
                })
                .ToListAsync();
        }
        public async Task<BrandResult?> GetByIdAsync(int id)
        {
            return await _dbContext.ThuongHieu
                .Where(b => b.MaThuongHieu == id && b.TrangThai == true)
                .Select(b => new BrandResult
                {
                    BrandID = b.MaThuongHieu,
                    BrandName = b.TenThuongHieu,
                    Status = b.TrangThai
                })
                .FirstOrDefaultAsync();
        }
        public async Task<BrandResult> CreateAsync(CreateBrandRequest request)
        {
            string BrandName = request.BrandName.Trim();

            bool isDuplicate = await _dbContext.ThuongHieu.AnyAsync(x => x.TenThuongHieu == BrandName && x.TrangThai == true);
            if (isDuplicate){
                throw new InvalidOperationException($"Thương hiệu '{BrandName}' đã tồn tại!");
            }
            var BrandNew = new ThuongHieu { TenThuongHieu = BrandName, TrangThai = true };
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
                Status = BrandNew.TrangThai
            };
        }
        public async Task<BrandResult?> UpdateAsync(int id, UpdateBrandRequest request)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null || brand.TrangThai == false) return null;
            string BrandName = request.BrandName.Trim();
            bool isDuplicate = await _dbContext.ThuongHieu
                .AnyAsync(x => x.TenThuongHieu == BrandName && x.MaThuongHieu != id && x.TrangThai == true);
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
                Status = brand.TrangThai
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var brand = await _dbContext.ThuongHieu.FindAsync(id);
            if (brand == null || brand.TrangThai == false) return false;
            brand.TrangThai = false;
            bool deleted = await _dbContext.SaveChangesAsync() > 0;
            if (!deleted)
            {
                throw new InvalidOperationException("Xóa thương hiệu thất bại!");
            }
            return true;
        }
    }
}
