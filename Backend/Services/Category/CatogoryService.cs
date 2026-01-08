using Backend.Data;
using Backend.DTO.Category;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly SlugHelper _slugHelper;

        public CategoryService(ApplicationDbContext dbContext, SlugHelper slugHelper)
        {
            _DbContext = dbContext;
            _slugHelper = slugHelper;
        }

        public async Task<IEnumerable<CategoryResult>> GetAllAsync()
        {
            return await _DbContext.DanhMuc
                .Where(x => x.TrangThai == true && x.Delete_At == null)
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
            var category = await _DbContext.DanhMuc.FindAsync(id);

            if (category == null || category.TrangThai == false || category.Delete_At != null)
                return null;

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
            return await _DbContext.DanhMuc
                .Where(x => x.Delete_At != null)
                .Select(d => new CategoryResult
                {
                    MaDanhMuc = d.MaDanhMuc,
                    TenDanhMuc = d.TenDanhMuc,
                    Slug = d.Slug,
                    TrangThai = d.TrangThai
                })
                .ToListAsync();
        }

        public async Task<CategoryResult> CreateAsync(CreateCategoryRequest request)
        {
            string ten = request.TenDanhMuc.Trim();

            bool isDuplicate = await _DbContext.DanhMuc
                .AnyAsync(x => x.TenDanhMuc == ten && x.TrangThai == true && x.Delete_At == null);

            if (isDuplicate)
                throw new InvalidOperationException($"Danh mục '{ten}' đã tồn tại.");

            string baseSlug = _slugHelper.GenerateSlug(ten);
            string uniqueSlug = await GenerateUniqueSlugAsync(baseSlug);

            var category = new DanhMuc
            {
                TenDanhMuc = ten,
                Slug = uniqueSlug,
                TrangThai = true,
                Delete_At = null
            };

            _DbContext.DanhMuc.Add(category);
            await _DbContext.SaveChangesAsync();

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
            var category = await _DbContext.DanhMuc.FindAsync(id);

            if (category == null || category.Delete_At != null)
                throw new InvalidOperationException("Danh mục không tồn tại hoặc đã bị xóa.");

            string tenMoi = request.TenDanhMuc.Trim();

            if (tenMoi != category.TenDanhMuc)
            {
                bool isDuplicate = await _DbContext.DanhMuc
                    .AnyAsync(x => x.MaDanhMuc != id
                                && x.TenDanhMuc == tenMoi
                                && x.TrangThai == true
                                && x.Delete_At == null);

                if (isDuplicate)
                    throw new InvalidOperationException($"Tên danh mục '{tenMoi}' đã tồn tại.");

                string baseSlug = _slugHelper.GenerateSlug(tenMoi);
                category.Slug = await GenerateUniqueSlugAsync(baseSlug, id);

                category.TenDanhMuc = tenMoi;
            }

            await _DbContext.SaveChangesAsync();

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
            var category = await _DbContext.DanhMuc.FindAsync(id);
            if (category == null) return false;

            bool isUsed = await _DbContext.SanPham
                .AnyAsync(p => p.MaDanhMuc == id && p.TrangThai == true);

            if (isUsed)
                throw new InvalidOperationException("Danh mục đang được sử dụng bởi sản phẩm, không thể xóa.");

            category.TrangThai = false;
            category.Delete_At = DateTime.Now;

            await _DbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RecoverAsync(int id)
        {
            var category = await _DbContext.DanhMuc.FindAsync(id);
            if (category == null || category.Delete_At == null) return false;

            bool isDuplicate = await _DbContext.DanhMuc
                .AnyAsync(x => x.MaDanhMuc != id
                            && x.TenDanhMuc == category.TenDanhMuc
                            && x.TrangThai == true
                            && x.Delete_At == null);

            if (isDuplicate)
                throw new InvalidOperationException("Tên danh mục bị trùng, không thể khôi phục.");

            category.Delete_At = null;
            category.TrangThai = true;

            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<List<ProductResult>> GetProductByCategoryAsync(string slug)
        {
            var category = await _DbContext.DanhMuc
                .FirstOrDefaultAsync(x =>
                    x.Slug == slug &&
                    x.TrangThai == true &&
                    x.Delete_At == null);

            if (category == null)
                return new List<ProductResult>();

            var products = await _DbContext.SanPham
                .Where(p =>
                    p.MaDanhMuc == category.MaDanhMuc &&
                    p.TrangThai == true)
                .Select(p => new ProductResult
                {
                    MaSanPham = p.MaSanPham,
                    TenSanPham = p.TenSanPham,
                    GiaCoBan = p.GiaCoBan,
                    Slug = p.Slug,
                    MaDanhMuc = category.MaDanhMuc,
                    TenDanhMuc = category.TenDanhMuc
                })
                .ToListAsync();

            return products;
        }

        private async Task<string> GenerateUniqueSlugAsync(string baseSlug, int? ignoreId = null)
        {
            string finalSlug = baseSlug;
            int count = 1;

            while (await _DbContext.DanhMuc
                .AnyAsync(x => x.Slug == finalSlug && x.MaDanhMuc != ignoreId))
            {
                finalSlug = $"{baseSlug}-{count}";
                count++;
            }

            return finalSlug;
        }
    }
}
