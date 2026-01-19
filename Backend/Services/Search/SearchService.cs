using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Numerics;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Azure.Core;
using Backend.Data;
using Backend.DTO.Product;
using Backend.DTO.Search;
using Backend.Helper;
using Backend.Models;
using Ecommerce.DTO.Product;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
namespace Backend.Services.Search
{
    public class SearchService : ISearchService
    {
        private readonly ApplicationDbContext _DbContext;

        public SearchService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }
        public async Task<SearchResult<SearchUserResult>> SearchProductsUserAsync(SearchUserRequest request)
        {
            var query = _DbContext.SanPham.AsQueryable();
            query.Where(p => p.NgayXoa == null);
            if (request.Keyword == null)
            {
                throw new InvalidOperationException("Keyword trống!");
            }
            else
            {
                query = query.Where(q =>
                                        q.TenSanPham.Contains(request.Keyword) ||
                                        q.BienThe.Any(bt =>
                                            bt.thongSoKyThuat.OCung.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.HeDieuHanh.Contains(request.Keyword)||
                                            bt.thongSoKyThuat.DoPhanGiaiManHinh.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.CongGiaoTiep.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.LoaiXuLyDoHoa.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.LoaiXuLyTrungTam.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.DungLuongRam.Contains(request.Keyword))||
                                        q.DanhMuc.TenDanhMuc.Contains(request.Keyword)

                                        );
            }
            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.MaDanhMuc == request.CategoryId.Value);
            }
            if (request.BrandIds != null && request.BrandIds.Any())
            {
                query = query.Where(p => request.BrandIds.Contains(p.MaThuongHieu));
            }
            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.BienThe.Any(b => b.GiaBan >= request.MinPrice.Value));
            }
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.BienThe.Any(b => b.GiaBan >= request.MaxPrice.Value));
            }
            int totalRow = await query.CountAsync();
            bool isAscending = request.SortOrder.Equals("ASC", StringComparison.OrdinalIgnoreCase);

            query = request.SortBy switch
            {
                "GiaBan" => isAscending
                    ? query.OrderBy(p => p.BienThe.Min(bt => bt.GiaBan))
                    : query.OrderByDescending(p => p.BienThe.Min(bt => bt.GiaBan)),

                "LuotXem" => isAscending
                    ? query.OrderBy(p => p.LuotXem)
                    : query.OrderByDescending(p => p.LuotXem),

                "LuotMua" => isAscending
                   ? query.OrderBy(p => p.LuotMua)
                    : query.OrderByDescending(p => p.LuotMua),

                "DanhGiaTrungBinh" => isAscending
                    ? query.OrderBy(p => p.DanhGiaTrungBinh)
                    : query.OrderByDescending(p => p.DanhGiaTrungBinh),

                _ => isAscending
                    ? query.OrderBy(p => p.NgayTao)
                    : query.OrderByDescending(p => p.NgayTao)
            };

            var result = await query
                        .Skip((request.Page - 1) * request.Limit)
                        .Take(request.Limit)
                        .Select(p => new SearchUserResult
                        {
                            MaSanPham = p.MaSanPham,
                            TenSanPham = p.TenSanPham,
                            SoLuongTon = p.SoLuongTon,
                            TenDanhMuc = p.DanhMuc.TenDanhMuc,
                            TenThuongHieu = p.ThuongHieu.TenThuongHieu,
                            DanhGiaTrungBinh = p.DanhGiaTrungBinh,
                            LuotXem = p.LuotXem,
                            LuotMua = p.LuotMua,
                            NgayTao = p.NgayTao,

                            HinhAnhSanPham = p.HinhAnhSanPham.Select(img => new HinhAnhSanPham
                            {
                                MaHinhAnh = img.MaHinhAnh,
                                DuongDanAnh = img.DuongDanAnh,
                                AnhChinh = img.AnhChinh
                            }).ToList(),

                            BienThe = p.BienThe.Select(bt => new ProductVariant
                            {
                                MaBTSP = bt.MaBTSP,
                                TenBienThe = bt.TenBienThe,
                                GiaBan = bt.GiaBan,
                                GiaKhuyenMai = bt.GiaKhuyenMai ?? 0,
                                SoLuongTon = bt.SoLuongTon,
                                OCung = bt.OCung,
                                Ram = bt.Ram,
                                MauSac = bt.MauSac,
                                BoXuLyTrungTam = bt.BoXuLyTrungTam,
                                BoXuLyDoHoa = bt.BoXuLyDoHoa,

                            }).ToList()
                        })
                        .ToListAsync();
            return new SearchResult<SearchUserResult> { 
                        TuKhoa = request.Keyword,
                        KetQua = result,
                        Tong = totalRow,
                        Trang = request.Page,
                        GioiHan = request.Limit
                        };
        }
        public async Task<SearchResult<SearchAdminResult>> SearchProductsAdminAsync(SearchAdminRequest request)
        {
            var query = _DbContext.SanPham.AsQueryable();
            if (request.IsDelete == true)
                query.Where(p => p.NgayXoa != null);
            if (request.Status.HasValue)
            {
                bool isStatusActive = request.Status.Value == 1;
                query.Where(p => p.TrangThai == isStatusActive);
            }
            if (request.Keyword == null)
            {
                throw new InvalidOperationException("Keyword trống!");
            }
            else
            {
                query = query.Where(q =>
                                        q.TenSanPham.Contains(request.Keyword) ||
                                        q.BienThe.Any(bt =>
                                            bt.thongSoKyThuat.OCung.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.HeDieuHanh.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.DoPhanGiaiManHinh.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.CongGiaoTiep.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.LoaiXuLyDoHoa.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.LoaiXuLyTrungTam.Contains(request.Keyword) ||
                                            bt.thongSoKyThuat.DungLuongRam.Contains(request.Keyword)) ||
                                        q.DanhMuc.TenDanhMuc.Contains(request.Keyword)
                                        );
            }
            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.MaDanhMuc == request.CategoryId.Value);
            }
            if (request.BrandIds != null && request.BrandIds.Any())
            {
                query = query.Where(p => request.BrandIds.Contains(p.MaThuongHieu));
            }
            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.BienThe.Any(b => b.GiaBan >= request.MinPrice.Value));
            }
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.BienThe.Any(b => b.GiaBan >= request.MaxPrice.Value));
            }
            int totalRow = await query.CountAsync();
            bool isAscending = request.SortOrder.Equals("ASC", StringComparison.OrdinalIgnoreCase);

            query = request.SortBy switch
            {
                "GiaBan" => isAscending
                    ? query.OrderBy(p => p.BienThe.Min(bt => bt.GiaBan))
                    : query.OrderByDescending(p => p.BienThe.Min(bt => bt.GiaBan)),

                "LuotXem" => isAscending
                    ? query.OrderBy(p => p.LuotXem)
                    : query.OrderByDescending(p => p.LuotXem),

                "LuotMua" => isAscending
                   ? query.OrderBy(p => p.LuotMua)
                    : query.OrderByDescending(p => p.LuotMua),

                "DanhGiaTrungBinh" => isAscending
                    ? query.OrderBy(p => p.DanhGiaTrungBinh)
                    : query.OrderByDescending(p => p.DanhGiaTrungBinh),

                _ => isAscending
                    ? query.OrderBy(p => p.NgayTao)
                    : query.OrderByDescending(p => p.NgayTao)
            };

            var result = await query
                        .Skip((request.Page - 1) * request.Limit)
                        .Take(request.Limit)
                        .Select(p => new SearchAdminResult
                        {
                            MaSanPham = p.MaSanPham,
                            TenSanPham = p.TenSanPham,
                            Slug = p.Slug,
                            SoLuongTon = p.SoLuongTon,
                            TenDanhMuc = p.DanhMuc.TenDanhMuc,
                            TenThuongHieu = p.ThuongHieu.TenThuongHieu,
                            DanhGiaTrungBinh = p.DanhGiaTrungBinh,
                            LuotXem = p.LuotXem,
                            LuotMua = p.LuotMua,
                            NgayTao = p.NgayTao,
                            NgayXoa = p.NgayXoa,

                            HinhAnhSanPham = p.HinhAnhSanPham.Select(img => new HinhAnhSanPham
                            {
                                MaHinhAnh = img.MaHinhAnh,
                                DuongDanAnh = img.DuongDanAnh,
                                AnhChinh = img.AnhChinh
                            }).ToList(),


                            BienThe = p.BienThe.Select(bt => new ProductVariant
                            {
                                MaBTSP = bt.MaBTSP,
                                TenBienThe = bt.TenBienThe,
                                GiaBan = bt.GiaBan,
                                GiaKhuyenMai = bt.GiaKhuyenMai ?? 0,
                                SoLuongTon = bt.SoLuongTon,
                                OCung = bt.OCung,
                                Ram = bt.Ram,
                                MauSac = bt.MauSac,
                                BoXuLyTrungTam = bt.BoXuLyTrungTam,
                                BoXuLyDoHoa = bt.BoXuLyDoHoa,

                            }).ToList()
                        })
                        .ToListAsync();

            return new SearchResult<SearchAdminResult> { 
                        TuKhoa = request.Keyword,
                        KetQua = result,
                        Tong = totalRow,
                        Trang = request.Page,
                        GioiHan = request.Limit
                        };
        }
    }
}   