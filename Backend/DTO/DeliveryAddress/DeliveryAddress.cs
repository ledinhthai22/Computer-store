namespace Ecommerce.DTO.DeliveryAddress;

public class Province
{
    public int Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DivisionType { get; set; } = string.Empty;
    public string Codename { get; set; } = string.Empty;
    public int PhoneCode { get; set; }
    public List<Ward>? Wards { get; set; } 
}

public class Ward
{
    public int Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DivisionType { get; set; } = string.Empty;
    public string Codename { get; set; } = string.Empty;
    public string? ShortCodename { get; set; }

}