using System.Security.Claims;
using Ecommerce.DTO.DeliveryAddress;
using Ecommerce.Services.DeliveryAddress;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers;

[ApiController]
[Route("api/delivery-address")]
public class DeliveryAddressController : ControllerBase
{
    private readonly IDeliveryAddress _service;

    public DeliveryAddressController(IDeliveryAddress service)
    {
        _service = service;
    }

    [HttpGet("provinces")]
    public async Task<IActionResult> GetProvinces([FromQuery] bool withWards = false)
    {
        var provinces = await _service.GetAllProvincesAsync(withWards);
        return Ok(provinces);
    }

    [HttpGet("province/{code:int}")]
    public async Task<IActionResult> GetProvince(int code, [FromQuery] bool withWards = false)
    {
        var province = await _service.GetProvinceByCodeAsync(code, withWards);
        return province != null ? Ok(province) : NotFound();
    }
    [HttpGet("user-addresses")]
    public async Task<IActionResult> GetUserAddresses()
    {
        var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var addresses = await _service.GetAddressesByUserAsync(maNguoiDung);
        return Ok(addresses);
    }

    [HttpGet("user-addresses/{id}")]
    public async Task<IActionResult> GetUserAddress(int id)
    {
        var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var address = await _service.GetAddressByIdAsync(id, maNguoiDung);
        return address != null ? Ok(address) : NotFound();
    }

    [HttpPost("user-addresses")]
    public async Task<IActionResult> CreateUserAddress([FromBody] CreateDeliveryAddress request)
    {
        try
        {
            var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (maNguoiDung == 0) return Unauthorized("Không tìm thấy user ID");

            Console.WriteLine($"Tạo địa chỉ cho user {maNguoiDung}: {System.Text.Json.JsonSerializer.Serialize(request)}");

            var created = await _service.CreateAddressAsync(request, maNguoiDung);
            return CreatedAtAction(nameof(GetUserAddress), new { id = created.MaDiaChiNhanHang }, created);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Lỗi tạo địa chỉ: {ex.Message}\nStack: {ex.StackTrace}");
            return StatusCode(500, new { message = "Lỗi server khi tạo địa chỉ", detail = ex.Message });
        }
    }

    [HttpPut("user-addresses/{id}")]
    public async Task<IActionResult> UpdateUserAddress(int id, [FromBody] CreateDeliveryAddress request)
    {
        var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _service.UpdateAddressAsync(id, request, maNguoiDung);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("user-addresses/{id}")]
    public async Task<IActionResult> DeleteUserAddress(int id)
    {
        var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _service.DeleteAddressAsync(id, maNguoiDung);
        return success ? NoContent() : NotFound();
    }

    [HttpPatch("user-addresses/{id}/default")]
    public async Task<IActionResult> SetDefault(int id)
    {
        var maNguoiDung = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _service.SetDefaultAddressAsync(id, maNguoiDung);
        return success ? NoContent() : NotFound();
    }
}