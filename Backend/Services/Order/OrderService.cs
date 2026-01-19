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
using Backend.DTO.Order;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Backend.Services.WishList;
using Microsoft.EntityFrameworkCore;
namespace Backend.Services.Order
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _DbContext;

        public OrderService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;

        }
        public async Task<List<OrderResult>> GetAllAsync()
        {
            return await _DbContext.DonHang
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.DiaChiNhanHang)
                .Include(dh => dh.ChiTietDonHang)
                .OrderByDescending(dh => dh.NgayTao)
                .Select(dh => new OrderResult
                {
                    MaDonHang = dh.MaDH,
                    MaDon = dh.MaDon,
                    TongTien = dh.TongTienThanhToan,
                    PhuongThucThanhToan = dh.PhuongThucThanhToan,
                    TrangThai = GetStatusText(dh.TrangThai),
                    NgayTao = dh.NgayTao == null ? "Chưa cập nhật"
                            : dh.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = dh.KhachHang.MaNguoiDung,
                        HoTen = dh.KhachHang.HoTen,
                        Email = dh.KhachHang.Email,
                        SoDienThoai = dh.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = dh.NguoiNhan,
                        TinhThanh = dh.TinhThanh,
                        PhuongXa = dh.PhuongXa,
                        DiaChi = dh.DiaChi,
                        SoDienThoai = dh.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = dh.ChiTietDonHang.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.BienThe.MaBTSP,
                        TenBienThe = ct.BienThe.TenBienThe,
                        SoLuong = ct.SoLuong,

                    }).ToList()
                })
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
        public async Task<List<OrderResult>> GetAllByStatusAsync(int status)
        {
            return await _DbContext.DonHang
                .Where(dh => dh.TrangThai == status)
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.DiaChiNhanHang)
                .Include(dh => dh.ChiTietDonHang)
                .OrderByDescending(dh => dh.NgayTao)
                .Select(dh => new OrderResult
                {
                    MaDonHang = dh.MaDH,
                    MaDon = dh.MaDon,
                    TongTien = dh.TongTienThanhToan,
                    PhuongThucThanhToan = dh.PhuongThucThanhToan,
                    TrangThai = GetStatusText(dh.TrangThai),
                    NgayTao = dh.NgayTao == null ? "Chưa cập nhật"
                            : dh.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = dh.KhachHang.MaNguoiDung,
                        HoTen = dh.KhachHang.HoTen,
                        Email = dh.KhachHang.Email,
                        SoDienThoai = dh.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = dh.NguoiNhan,
                        TinhThanh = dh.TinhThanh,
                        PhuongXa = dh.PhuongXa,
                        DiaChi = dh.DiaChi,
                        SoDienThoai = dh.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = dh.ChiTietDonHang.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.BienThe.MaBTSP,
                        TenBienThe = ct.BienThe.TenBienThe,
                        SoLuong = ct.SoLuong,

                    }).ToList()
                })
                .ToListAsync();
        }
        public async Task<OrderResult> GetByMaDHAsync(int MaDH)
        {
            return await _DbContext.DonHang
                .Where(dh => dh.MaDH == MaDH)
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.DiaChiNhanHang)
                .Include(dh => dh.ChiTietDonHang)
                .Select(dh => new OrderResult
                {
                    MaDonHang = dh.MaDH,
                    MaDon = dh.MaDon,
                    TongTien = dh.TongTienThanhToan,
                    PhuongThucThanhToan = dh.PhuongThucThanhToan,
                    TrangThai = GetStatusText(dh.TrangThai),
                    NgayTao = dh.NgayTao == null ? "Chưa cập nhật"
                            : dh.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = dh.KhachHang.MaNguoiDung,
                        HoTen = dh.KhachHang.HoTen,
                        Email = dh.KhachHang.Email,
                        SoDienThoai = dh.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = dh.NguoiNhan,
                        TinhThanh = dh.TinhThanh,
                        PhuongXa = dh.PhuongXa,
                        DiaChi = dh.DiaChi,
                        SoDienThoai = dh.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = dh.ChiTietDonHang.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.BienThe.MaBTSP,
                        TenBienThe = ct.BienThe.TenBienThe,
                        SoLuong = ct.SoLuong,

                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
        public async Task<OrderResult> GetByMaDonAsync(string MaDon)
        {
            return await _DbContext.DonHang
                .Where(dh => dh.MaDon == MaDon)
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.DiaChiNhanHang)
                .Include(dh => dh.ChiTietDonHang)
                .Select(dh => new OrderResult
                {
                    MaDonHang = dh.MaDH,
                    MaDon = dh.MaDon,
                    TongTien = dh.TongTienThanhToan,
                    PhuongThucThanhToan = dh.PhuongThucThanhToan,
                    TrangThai = GetStatusText(dh.TrangThai),
                    NgayTao = dh.NgayTao == null ? "Chưa cập nhật"
                            : dh.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = dh.KhachHang.MaNguoiDung,
                        HoTen = dh.KhachHang.HoTen,
                        Email = dh.KhachHang.Email,
                        SoDienThoai = dh.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = dh.NguoiNhan,
                        TinhThanh = dh.TinhThanh,
                        PhuongXa = dh.PhuongXa,
                        DiaChi = dh.DiaChi,
                        SoDienThoai = dh.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = dh.ChiTietDonHang.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.BienThe.MaBTSP,
                        TenBienThe = ct.BienThe.TenBienThe,
                        SoLuong = ct.SoLuong,

                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
        public async Task<bool> UpdateStatusAsync(int MaDH, UpdateOrderStatusRequest request)
        {
            var order = await _DbContext.DonHang
                                .Include(dh => dh.ChiTietDonHang)
                                .FirstOrDefaultAsync(dh => dh.MaDH == MaDH);
            Console.WriteLine(order);
            if (order == null)
            {
                throw new InvalidOperationException("Không tồn tại Đơn hàng này!");
            }
            if (request.TrangThai < 0 || request.TrangThai > 7)
                throw new InvalidOperationException("Trạng thái không tồn tại (phải từ 0-7)!");
            if (request.TrangThai <= order.TrangThai)
                throw new InvalidOperationException($"Không thể cập nhật: Trạng thái mới ({request.TrangThai}) phải lớn hơn trạng thái hiện tại ({order.TrangThai}).");
            if (request.TrangThai == 1)
            {
                foreach (var BienThe in order.ChiTietDonHang)
                {
                    var bt = await _DbContext.BienThe
                                    .Where(bt => bt.NgayXoa == null)
                                    .FirstOrDefaultAsync(bt => bt.MaBTSP == BienThe.MaBienThe);
                    if (bt == null)
                    {
                        throw new InvalidOperationException("Sản phẩm hiện tại không có!");
                    }
                    else if (bt.SoLuongTon < BienThe.SoLuong)
                    {
                        throw new InvalidOperationException("Số lượng sản phẩm tồn lớn hơn số lượng sản phẩm bán!");
                    }
                    else
                    {
                        bt.SoLuongTon -= BienThe.SoLuong;
                        _DbContext.BienThe.Update(bt);
                        if (!(await _DbContext.SaveChangesAsync() > 0))
                        {
                            throw new InvalidOperationException("Cập nhật số lượng sản phẩm không thành công!");
                        }
                        order.TrangThai = request.TrangThai;
                        _DbContext.DonHang.Update(order);
                        if (!(await _DbContext.SaveChangesAsync() > 0))
                            return false;
                        return true;

                    }
                }
            }
            else
            {
                order.TrangThai = request.TrangThai;
                _DbContext.DonHang.Update(order);
                if (!(await _DbContext.SaveChangesAsync() > 0))
                    return false;
                return true;
            }
            return false;
        }

        private DateTime OrderToday { get; set; } = DateTime.Now;
        private int OrderCountToday { get; set; } = 0;
        private async Task CheckValidateCreateOrder(CreateOrderInfoRequest request)
        {
            decimal TienGoc = 0, ThanhToan = 0;
            foreach (var BienThe in request.ChiTietDonHang)
            {
                var bt = await _DbContext.BienThe
                                .Where(bt => bt.NgayXoa == null)
                                .FirstOrDefaultAsync(bt => bt.MaBTSP == BienThe.MaBienThe);
                if (bt == null)
                {
                    throw new InvalidOperationException("Sản phẩm hiện tại không có!");
                }
                else if (bt.SoLuongTon < BienThe.SoLuong)
                {
                    throw new InvalidOperationException("Số lượng sản phẩm mua lớn hơn số lượng tồn!");
                }
                TienGoc += (bt.GiaBan * BienThe.SoLuong);
                ThanhToan += (bt.GiaKhuyenMai ?? 0 * BienThe.SoLuong);
            }
            if (request.TongTienGoc < request.TongTienThanhToan)
            {
                throw new InvalidOperationException("Tổng tiền thanh toán không được lớn hơn tổng tiền gốc!");
            }
            if (!(await _DbContext.NguoiDung.AnyAsync(ng => ng.MaNguoiDung == request.MaKH && ng.NgayXoa == null)))
            {
                throw new InvalidOperationException($"Người dùng mã:{request.MaKH} không tồn tại!");
            }
            if (!(await _DbContext.DiaChiNhanHang.AnyAsync(ng => ng.MaDiaChiNhanHang == request.MaDiaChiNhanHang && ng.NgayXoa == null)))
            {
                throw new InvalidOperationException($"Địa chỉ nhận hàng mã: {request.MaDiaChiNhanHang} không tồn tại!");
            }
            if (request.PhuongThucThanhToan != 1 || request.PhuongThucThanhToan != 2)
            {
                throw new InvalidOperationException($"Phương thức thanh toán sai!");
            }
            if (request.TongTienGoc != TienGoc)
            {
                throw new InvalidOperationException("Tổng tiền góc đã thay đổi!");
            }
            if (request.TongTienThanhToan != ThanhToan)
            {
                throw new InvalidOperationException("Tổng tiền thanh toán đã thay đổi!");
            }
            if (request.TongTienThanhToan > request.TongTienGoc)
            {
                throw new InvalidOperationException("Tổng tiền góc nhỏ hơn tổng thanh toán!");
            }
        }
        private string CreateMaDH(int PhuongThucThanhToan)
        {
            DateTime now = DateTime.Now;
            if (OrderToday.Date != now.Date)
            {
                OrderToday = now;
                OrderCountToday = 1;
            }
            else
            {
                OrderCountToday++;
            }
            string phuongThuc = (PhuongThucThanhToan == 1) ? "01" : "02";
            string MaDon = $"ORD{now:yyyyMMdd}{phuongThuc}{OrderCountToday:D3}";
            Console.WriteLine(MaDon);
            return MaDon;
        }
        private async Task<List<ChiTietDonHang>> CreateOrderDetails(int MaDH, List<CreateOrderDetailRequest> request)
        {
            var orderDetails = new List<ChiTietDonHang>();
            foreach (var item in request)
            {
                var orderDetail = new ChiTietDonHang
                {
                    MaDonHang = MaDH,
                    MaBienThe = item.MaBienThe,
                    SoLuong = item.SoLuong
                };
                orderDetails.Add(orderDetail);
            }
            await _DbContext.ChiTietDonHang.AddRangeAsync(orderDetails);
            bool result = await _DbContext.SaveChangesAsync() > 0;
            if (!result) return null;
            return orderDetails;
        }
        public async Task<OrderResult> CreateOrderAsync(CreateOrderInfoRequest request)
        {
            await CheckValidateCreateOrder(request);

            string MaDon = CreateMaDH(request.PhuongThucThanhToan);

            var newOrder = new DonHang
            {
                MaDon = MaDon,
                MaKH = request.MaKH,
                MaDiaChiNhanHang = request.MaDiaChiNhanHang,
                DiaChi = request.DiaChi,
                PhuongXa = request.PhuongXa,
                TinhThanh = request.TinhThanh,
                SoDienThoaiNguoiNhan = request.SoDienThoaiNguoiNhan,
                NguoiNhan = request.NguoiNhan,
                GhiChu = request.GhiChu,
                GhiChuNoiBo = request.GhiChuNoiBo,
                TongTienGoc = request.TongTienGoc,
                TongTienThanhToan = request.TongTienThanhToan,
                PhuongThucThanhToan = request.PhuongThucThanhToan,
                TrangThai = 0,
                NgayTao = DateTime.Now
            };
            await _DbContext.DonHang.AddAsync(newOrder);
            if (!(await _DbContext.SaveChangesAsync() > 0))
            {
                throw new InvalidOperationException("Tạo đơn hàng không thành công!");
            }
            else
            {
                var orderDetails = await CreateOrderDetails(newOrder.MaDH, request.ChiTietDonHang);

                if (orderDetails == null)
                {
                    throw new InvalidOperationException("Tạo chi tiết đơn hàng không thành công!");
                }
                return new OrderResult
                {
                    MaDonHang = newOrder.MaDH,
                    MaDon = newOrder.MaDon,
                    TongTien = newOrder.TongTienThanhToan,
                    PhuongThucThanhToan = newOrder.PhuongThucThanhToan,
                    TrangThai = GetStatusText(newOrder.TrangThai),
                    NgayTao = newOrder.NgayTao == null ? "Chưa cập nhật"
                            : newOrder.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = newOrder.KhachHang.MaNguoiDung,
                        HoTen = newOrder.KhachHang.HoTen,
                        Email = newOrder.KhachHang.Email,
                        SoDienThoai = newOrder.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = newOrder.NguoiNhan,
                        TinhThanh = newOrder.TinhThanh,
                        PhuongXa = newOrder.PhuongXa,
                        DiaChi = newOrder.DiaChi,
                        SoDienThoai = newOrder.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = orderDetails.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.MaBienThe,
                        SoLuong = ct.SoLuong,
                        TenBienThe = _DbContext.BienThe
                                        .Where(bt => bt.NgayXoa == null)
                                        .FirstOrDefault(bt => bt.MaBTSP == ct.MaBienThe)!.TenBienThe
                    }).ToList()
                };
            }
        }
        private async Task<(NguoiDung User, DiaChiNhanHang Address, List<ChiTietGioHang> CartItems, decimal TienGoc, decimal ThanhToan)> ValidateAndPrepareData(int userId, CheckoutCartRequest request)
        {
            var user = await _DbContext.NguoiDung
                .FirstOrDefaultAsync(u => u.MaNguoiDung == userId && u.NgayXoa == null);

            if (user == null)
                throw new InvalidOperationException($"Người dùng ID {userId} không tồn tại.");

            var address = await _DbContext.DiaChiNhanHang
                .FirstOrDefaultAsync(d => d.MaDiaChiNhanHang == request.MaDiaChiNhanHang && d.MaNguoiDung == userId && d.NgayXoa == null);

            if (address == null)
                throw new InvalidOperationException($"Địa chỉ nhận hàng (ID: {request.MaDiaChiNhanHang}) không tồn tại hoặc đã bị xóa!");

            var cartItems = await _DbContext.ChiTietGioHang
                .Include(c => c.BienThe)
                .Where(c => c.MaNguoiDung == userId && request.SelectedVariantIds.Contains(c.MaBienThe))
                .ToListAsync();

            if (!cartItems.Any())
                throw new InvalidOperationException("Giỏ hàng trống hoặc sản phẩm chọn mua không hợp lệ.");

            if (cartItems.Count != request.SelectedVariantIds.Count)
                throw new InvalidOperationException("Một số sản phẩm trong giỏ đã bị xóa hoặc ngừng kinh doanh.");

            decimal TienGoc = 0, ThanhToan = 0;
            foreach (var item in cartItems)
            {
                if (item.BienThe.NgayXoa != null)
                    throw new InvalidOperationException($"Sản phẩm '{item.BienThe.TenBienThe}' đã ngừng kinh doanh.");

                if (item.BienThe.SoLuongTon < item.SoLuong)
                    throw new InvalidOperationException($"Sản phẩm '{item.BienThe.TenBienThe}' không đủ hàng (Còn: {item.BienThe.SoLuongTon}).");

                TienGoc += (item.BienThe.GiaBan * item.SoLuong);
                ThanhToan += (item.BienThe.GiaKhuyenMai ?? 0 * item.SoLuong);
            }
            if (TienGoc > ThanhToan)
            {
                throw new InvalidOperationException($"Giá sản phẩm đã thay đổi. Tổng tiền góc: {TienGoc:N0}đ.Tổng tiền thanh toán: {ThanhToan:N0}đ. Vui lòng tải lại giỏ hàng!");
            }
            return (user, address, cartItems, TienGoc, ThanhToan);
        }
        public async Task<OrderResult> CreateOrderFromCartAsync(int userId, CheckoutCartRequest request)
        {

            var data = await ValidateAndPrepareData(userId, request);
            string maDon = CreateMaDH(request.PhuongThucThanhToan);

            var newOrder = new DonHang
            {
                MaDon = maDon,
                MaKH = userId,
                NgayTao = DateTime.Now,
                TrangThai = 0,
                TongTienGoc = data.TienGoc,
                TongTienThanhToan = data.ThanhToan,
                PhuongThucThanhToan = request.PhuongThucThanhToan,

                MaDiaChiNhanHang = data.Address.MaDiaChiNhanHang,
                NguoiNhan = data.Address.TenNguoiNhan,
                SoDienThoaiNguoiNhan = data.Address.SoDienThoai,

                TinhThanh = data.Address.TinhThanh,
                PhuongXa = data.Address.PhuongXa,
                DiaChi = data.Address.DiaChi,

                GhiChu = request.GhiChu ?? "",
                GhiChuNoiBo = string.Empty
            };

            _DbContext.DonHang.Add(newOrder);
            if(!(await _DbContext.SaveChangesAsync()>0))
                throw new InvalidOperationException("Tạo đơn hàng không thành công!");

            var orderDetailsEntities = new List<ChiTietDonHang>();

            foreach (var item in data.CartItems)
            {
                orderDetailsEntities.Add(new ChiTietDonHang
                {
                    MaDonHang = newOrder.MaDH,
                    MaBienThe = item.MaBienThe,
                    SoLuong = item.SoLuong
                });
            }

            await _DbContext.ChiTietDonHang.AddRangeAsync(orderDetailsEntities);

            _DbContext.ChiTietGioHang.RemoveRange(data.CartItems);

            await _DbContext.SaveChangesAsync();
            return new OrderResult
            {
                MaDonHang = newOrder.MaDH,
                MaDon = newOrder.MaDon,
                TongTien = newOrder.TongTienThanhToan,
                PhuongThucThanhToan = newOrder.PhuongThucThanhToan,

                TrangThai = "Chờ duyệt",
                NgayTao = newOrder.NgayTao.ToString("HH:mm dd/MM/yyyy"),

                GhiChu = newOrder.GhiChu,
                GhiChuNoiBo = newOrder.GhiChuNoiBo,

                KhachHang = new OrderCustomer
                {
                    MaNguoiDung = data.User.MaNguoiDung,
                    HoTen = data.User.HoTen,
                    Email = data.User.Email,
                    SoDienThoai = data.User.SoDienThoai
                },

                DiaChi = new OrderAddress
                {
                    TenNguoiNhan = newOrder.NguoiNhan,
                    SoDienThoai = newOrder.SoDienThoaiNguoiNhan,
                    TinhThanh = newOrder.TinhThanh,
                    PhuongXa = newOrder.PhuongXa,
                    DiaChi = newOrder.DiaChi
                },

                ChiTietDonHang = orderDetailsEntities.Select(od => new OrderDetail
                {
                    MaBienThe = od.MaBienThe,
                    SoLuong = od.SoLuong,
                    TenBienThe = data.CartItems
                                .First(c => c.MaBienThe == od.MaBienThe).BienThe.TenBienThe
                }).ToList()
            };
        }
        public async Task<OrderResult> UpdateOrderInfoAsync(int MaDH, int MaND, UpdateOrderInfo request)
        {
            if (request == null) throw new InvalidOperationException("Thông tin cập nhật bị trống!");

            if (string.IsNullOrWhiteSpace(request.PhuongXa) ||
                string.IsNullOrWhiteSpace(request.TinhThanh) ||
                string.IsNullOrWhiteSpace(request.DiaChi) ||
                string.IsNullOrWhiteSpace(request.NguoiNhan) ||
                string.IsNullOrWhiteSpace(request.SoDienThoaiNguoiNhan))
            {
                throw new InvalidOperationException("Vui lòng điền đầy đủ thông tin nhận hàng!");
            }
            var order = await _DbContext.DonHang
                                .FirstOrDefaultAsync(o => o.MaDH == MaDH);
            var user = await _DbContext.NguoiDung
                                .Include(u=> u.VaiTro)
                                .FirstOrDefaultAsync(u => u.MaNguoiDung == MaND && u.NgayXoa == null);
            if (order == null)
            {
                throw new InvalidOperationException($"Khong tim thay Hoa Don {MaDH}!");
            }
            if (user.VaiTro.TenVaiTro == "NguoiDung" && order.MaKH != MaND)
            {
                throw new InvalidOperationException("Bạn không có quyền sửa đơn hàng của người khác!");
            }
            if (order.TrangThai != 0 && user.VaiTro.TenVaiTro == "NguoiDung")
            {
                throw new InvalidOperationException("Đơn hàng đã được duyệt, vui lòng liên hệ Admin!");
            }
            order.NguoiNhan = request.NguoiNhan;
            order.SoDienThoaiNguoiNhan = request.SoDienThoaiNguoiNhan;
            order.TinhThanh = request.TinhThanh;
            order.PhuongXa = request.PhuongXa;
            order.DiaChi = request.DiaChi;
            await _DbContext.SaveChangesAsync();
            return await GetByMaDHAsync(MaDH);
        }
        public async Task<OrderResult> GetOrderByPhoneAsync(string Phone)
        {
            if (string.IsNullOrWhiteSpace(Phone) || Phone.Length < 10)
            {
                throw new ArgumentException("Số điện thoại không hợp lệ (Phải từ 10 số trở lên).");
            }
            return await _DbContext.DonHang
                .Where(dh => dh.SoDienThoaiNguoiNhan == Phone)
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.DiaChiNhanHang)
                .Include(dh => dh.ChiTietDonHang)
                .Select(dh => new OrderResult
                {
                    MaDonHang = dh.MaDH,
                    MaDon = dh.MaDon,
                    TongTien = dh.TongTienThanhToan,
                    PhuongThucThanhToan = dh.PhuongThucThanhToan,
                    TrangThai = GetStatusText(dh.TrangThai),
                    NgayTao = dh.NgayTao == null ? "Chưa cập nhật"
                            : dh.NgayTao.ToString("HH:mm dd/MM/yyyy"),
                    KhachHang = new OrderCustomer
                    {
                        MaNguoiDung = dh.KhachHang.MaNguoiDung,
                        HoTen = dh.KhachHang.HoTen,
                        Email = dh.KhachHang.Email,
                        SoDienThoai = dh.KhachHang.SoDienThoai
                    },
                    DiaChi = new OrderAddress
                    {
                        TenNguoiNhan = dh.NguoiNhan,
                        TinhThanh = dh.TinhThanh,
                        PhuongXa = dh.PhuongXa,
                        DiaChi = dh.DiaChi,
                        SoDienThoai = dh.SoDienThoaiNguoiNhan
                    },
                    ChiTietDonHang = dh.ChiTietDonHang.Select(ct => new OrderDetail
                    {
                        MaBienThe = ct.BienThe.MaBTSP,
                        TenBienThe = ct.BienThe.TenBienThe,
                        SoLuong = ct.SoLuong,

                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
