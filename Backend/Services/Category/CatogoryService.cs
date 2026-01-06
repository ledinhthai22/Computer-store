using Backend.Data;
using Backend.DTO.Category;
using Backend.Helper;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly SlugHelper _slugHelper;

        public CategoryService(ApplicationDbContext dbContext, SlugHelper slugHelper)
        {
            _dbContext = dbContext;
            _slugHelper = slugHelper;
        }


        public async Task<IEnumerable<CategoryResult>> GetAllAsync()
        {
            return await _dbContext.DanhMuc
                .Where(x => x.TrangThai == true)
                .Select(d => new CategoryResult
                {
                    MaDanhMuc = d.MaDanhMuc,
                    TenDanhMuc = d.TenDanhMuc,
                    Slug = d.Slug,
                    TrangThai = d.TrangThai
                })
                .ToListAsync();
        }


        public async Task<CategoryResult?> GetByIdAsync(int id)
        {
            var category = await _dbContext.DanhMuc.FindAsync(id);
            if (category == null || !category.TrangThai) return null;

            return new CategoryResult
            {
                MaDanhMuc = category.MaDanhMuc,
                TenDanhMuc = category.TenDanhMuc,
                Slug = category.Slug,
                TrangThai = category.TrangThai
            };
        }

        public async Task<IEnumerable<CategoryResult>> GetDeleteListAsync()
        {
            return await _dbContext.DanhMuc
                .Where(x => x.TrangThai == false)
                .Select(d => new CategoryResult
                {
                    MaDanhMuc = d.MaDanhMuc,
                    TenDanhMuc = d.TenDanhMuc,
                    Slug = d.Slug,
                    TrangThai  = d.TrangThai
                })
                .ToListAsync();
        }


        public async Task<CategoryResult> CreateAsync(CreateCategoryRequest request)
        {
            string ten = request.TenDanhMuc.Trim();

            bool isDuplicate = await _dbContext.DanhMuc
                .AnyAsync(x => x.TenDanhMuc == ten && x.TrangThai == true);

            if (isDuplicate)
                throw new InvalidOperationException($"Danh mục '{ten}' đã tồn tại.");

            string baseSlug = _slugHelper.GenerateSlug(ten);
            string uniqueSlug = await GenerateUniqueSlugAsync(baseSlug);

            var category = new DanhMuc
            {
                TenDanhMuc = ten,
                Slug = uniqueSlug,
                TrangThai = true
            };

            _dbContext.DanhMuc.Add(category);
            await _dbContext.SaveChangesAsync();

            return new CategoryResult
            {
                MaDanhMuc = category.MaDanhMuc,
                TenDanhMuc = category.TenDanhMuc,
                Slug = category.Slug,
                TrangThai = category.TrangThai
            };
        }

        public async Task<CategoryResult?> UpdateAsync(int id, UpdateCategoryRequest request)
        {
            var category = await _dbContext.DanhMuc.FindAsync(id);
            if (category == null) return null;

            string tenMoi = request.TenDanhMuc.Trim();

            if (tenMoi != category.TenDanhMuc)
            {
                bool isDuplicate = await _dbContext.DanhMuc
                    .AnyAsync(x => x.MaDanhMuc != id && x.TenDanhMuc == tenMoi && x.TrangThai == true);

                if (isDuplicate)
                    throw new InvalidOperationException($"Tên danh mục '{tenMoi}' đã tồn tại.");

                string baseSlug = _slugHelper.GenerateSlug(tenMoi);
                category.Slug = await GenerateUniqueSlugAsync(baseSlug, id);

                category.TenDanhMuc = tenMoi;
            }

            await _dbContext.SaveChangesAsync();

            return new CategoryResult
            {
                MaDanhMuc = category.MaDanhMuc,
                TenDanhMuc = category.TenDanhMuc,
                Slug = category.Slug,
                TrangThai = category.TrangThai
            };
        }

       
        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _dbContext.DanhMuc.FindAsync(id);
            if (category == null) return false;

            bool isUsed = await _dbContext.SanPham
                .AnyAsync(p => p.MaDanhMuc == id && p.TrangThai == true);

            if (isUsed)
                throw new InvalidOperationException("Danh mục đang được sử dụng bởi sản phẩm, không thể xóa.");

            category.TrangThai = false;

            await _dbContext.SaveChangesAsync();
            return true;
        }


        public async Task<bool> RecoverAsync(int id)
        {
            var category = await _dbContext.DanhMuc.FindAsync(id);
            if (category == null) return false;

            bool isDuplicate = await _dbContext.DanhMuc
                .AnyAsync(x => x.MaDanhMuc != id
                            && x.TrangThai == true
                            && x.TenDanhMuc == category.TenDanhMuc);

            if (isDuplicate)
                throw new InvalidOperationException("Tên danh mục bị trùng, không thể khôi phục.");

            category.TrangThai = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }


        private async Task<string> GenerateUniqueSlugAsync(string baseSlug, int? ignoreId = null)
        {
            string finalSlug = baseSlug;
            int count = 1;

            while (await _dbContext.DanhMuc
                .AnyAsync(x => x.Slug == finalSlug && x.MaDanhMuc != ignoreId))
            {
                finalSlug = $"{baseSlug}-{count}";
                count++;
            }

            return finalSlug;
        }
    }
}
