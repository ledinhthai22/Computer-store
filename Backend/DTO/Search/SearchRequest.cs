using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.User;
using Backend.Models;

namespace Backend.DTO.Search
{
    public class SearchUserRequest
    { 
        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public List<int>? BrandIds { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá thấp nhất phải lớn hơn 0")]
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Trang phải bắt đầu từ 1")]
        public int Page { get; set; } = 1; 

        [Range(1, 100, ErrorMessage = "Giới hạn tối đa 100 sản phẩm/trang")]
        public int Limit { get; set; } = 20; 
        public string SortBy { get; set; } = "NgayTao";//Sort theo NgayTao, GiaBan, LuotXem, LuotMua, DanhGiaTrungBinh
        [RegularExpression("(?i)^(ASC|DESC)$", ErrorMessage = "Chỉ chấp nhận ASC hoặc DESC")]
        public string SortOrder { get; set; } = "DESC";
    }
    public class SearchAdminRequest 
    {
        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public List<int>? BrandIds { get; set; }
        public int? Status { get; set; } = 1;
        public bool? IsDelete { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá thấp nhất phải lớn hơn 0")]
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Trang phải bắt đầu từ 1")]
        public int Page { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Giới hạn tối đa 100 sản phẩm/trang")]
        public int Limit { get; set; } = 20;
        public string SortBy { get; set; } = "NgayTao";//Sort theo NgayTao, GiaBan, LuotXem, LuotMua, DanhGiaTrungBinh
        [RegularExpression("(?i)^(ASC|DESC)$", ErrorMessage = "Chỉ chấp nhận ASC hoặc DESC")]
        public string SortOrder { get; set; } = "DESC";
    }
}
