using Backend.Data;
using Backend.DTO.Statistics;
using Backend.Helper;
using Backend.Models;
using Ecommerce.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Backend.Services.Order;
namespace Backend.Services.Statistics
{
    public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IOrderService _orderService;
        public StatisticsService(ApplicationDbContext dbContext, IOrderService orderService)
        {
            _dbContext = dbContext;
            _orderService = orderService;
        }
        public async Task<SalesOverview> GetSalesOverview()
        {
            var result = new SalesOverview();
            var orders = await _dbContext.DonHang
                .Where(dh => dh.TrangThai == 5)
                .ToListAsync();
            result.TongDonHang = orders.Count;
            result.TongDoanhThu = orders.Sum(dh => dh.TongTienThanhToan);
            result.ChiTietDoanhThu = orders
                    .GroupBy(dh => dh.NgayTao.Date)
                    .OrderBy(g => g.Key)
                    .Select(g => new Detail
                    {
                        MocThoiGian = g.Key.ToString("dd/MM/yyyy"),
                        DoanhThu = g.Sum(dh => dh.TongTienThanhToan)
                    })
                    .ToList();
            return result;
        }
        public async Task<List<ProductSales>> GetTopSellingProducts(int top = 5)
        {
            return await _dbContext.ChiTietDonHang
                        .Include(ct => ct.BienThe)
                        .Include(ct => ct.DonHang)
                        .Where(ct => ct.DonHang.TrangThai == 5)
                        .GroupBy(ct => new
                        {
                            ct.BienThe.SanPham.MaSanPham,
                            ct.BienThe.SanPham.TenSanPham
                        })
                        .Select(g => new ProductSales
                        {
                            MaSanPham = g.Key.MaSanPham,
                            TenSanPham = g.Key.TenSanPham,

                            TongSoLuongDaBan = g.Sum(x => x.SoLuong),

                            TongDoanhThu = g.Sum(x => x.DonHang.TongTienThanhToan)
                        })
                        .OrderByDescending(x => x.TongSoLuongDaBan)
                        .Take(top)
                        .ToListAsync();
        }
        private static string GetStatusText(int status)
        {
            return status switch
            {
                0 => "Chờ duyệt",
                1 => "Đã duyệt",
                2 => "Đang xử lý",
                3 => "Đang giao",
                4 => "Đã giao",
                5 => "Hoàn thành",
                6 => "Đã hủy",
                7 => "Trả hàng",
                _ => "Không xác định"
            };
        }
        public async Task<List<OrderStatus>> GetOrderStatusStatistics()
        {
            var rawData = await _dbContext.DonHang
                                .GroupBy(dh => dh.TrangThai)
                                .Select(g => new
                                {
                                    StatusId = g.Key,             
                                    Count = g.Count(),
                                    Total = g.Sum(dh => dh.TongTienThanhToan)
                                })
                                .ToListAsync();
            var result = rawData.Select(x => new OrderStatus
            {
                TrangThai = GetStatusText(x.StatusId),
                TongDonHang = x.Count,
                TongTien = x.Total
            }).ToList();
            return result;
        }
    }
}
