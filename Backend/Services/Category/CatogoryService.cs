using Backend.Data;
using Backend.DTO.Category;
using Backend.Helper;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

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

            if (category == null || category.TrangThai == false) return null;

            return new CategoryResult
            {
                MaDanhMuc = category.MaDanhMuc,
                TenDanhMuc = category.TenDanhMuc,
                Slug = category.Slug,
                TrangThai = category.TrangThai
            };
        }

        public async Task<CategoryResult> CreateAsync(CreateCategoryRequest request)
        {

            string tenDanhMucChuan = request.TenDanhMuc.Trim();


            bool isDuplicate = await _dbContext.DanhMuc
                .AnyAsync(x => x.TenDanhMuc == tenDanhMucChuan && x.TrangThai == true);

            if (isDuplicate)
            {

                throw new InvalidOperationException($"Danh mục '{tenDanhMucChuan}' đã tồn tại.");
            }


            string baseSlug = _slugHelper.GenerateSlug(tenDanhMucChuan);
            string uniqueSlug = await GenerateUniqueSlugAsync(baseSlug);


            var category = new DanhMuc
            {
                TenDanhMuc = tenDanhMucChuan,
                TrangThai = true,
                Slug = uniqueSlug
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


            if (category.TenDanhMuc != tenMoi)
            {

                bool isDuplicate = await _dbContext.DanhMuc
                    .AnyAsync(x => x.TenDanhMuc == tenMoi
                                   && x.TrangThai == true
                                   && x.MaDanhMuc != id);

                if (isDuplicate)
                {
                    throw new InvalidOperationException($"Tên danh mục '{tenMoi}' đã được sử dụng.");
                }


                string baseSlug = _slugHelper.GenerateSlug(tenMoi);

                category.Slug = await GenerateUniqueSlugAsync(baseSlug);


                category.TenDanhMuc = tenMoi;
            }


            category.TrangThai = request.TrangThai;

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

            if (category == null || category.TrangThai == false) return false;

            bool isUsed = await _dbContext.SanPham
                .AnyAsync(p => p.MaDanhMuc == id && p.TrangThai == true);

            if (isUsed)
            {
                throw new InvalidOperationException("Danh mục đang chứa sản phẩm, không thể xóa.");
            }

            category.TrangThai = false;

            await _dbContext.SaveChangesAsync();

            return true;
        }

        private async Task<string> GenerateUniqueSlugAsync(string baseSlug, int? ignoreId = null)
        {
            string finalSlug = baseSlug;
            int counter = 1;


            while (await _dbContext.DanhMuc.AnyAsync(c => c.Slug == finalSlug && c.MaDanhMuc != ignoreId))
            {

                finalSlug = $"{baseSlug}-{counter}";
                counter++;
            }

            return finalSlug;
        }
    }
}