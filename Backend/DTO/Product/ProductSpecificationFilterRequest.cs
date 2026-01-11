namespace Ecommerce.DTO.Product
{
    public class ProductSpecificationFilterRequest
    {
        public string? DongChip { get; set; }          
        public string? DongCard { get; set; }             
        public string? KichThuocManHinh { get; set; }          
        public string? Ram { get; set; }              
        public string? OCung { get; set; }           
        public decimal? GiaTu { get; set; }
        public decimal? GiaDen { get; set; }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}
