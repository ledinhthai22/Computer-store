using Backend.DTO.Contact;
using Backend.Services.Contact;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.Migrations;
namespace Backend.Controller.Admin.Contact
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _IContactService;
        public ContactController(IContactService IContactService)
        {
            _IContactService = IContactService;
        }
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _IContactService.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("AllUnread")]
        [Authorize(Roles = "QuanTriVien")]
        public async Task<IActionResult> GetAllUnread ()
        {
            var result = await _IContactService.GetAllUnreadAsync();
            return Ok(result);
        }
        [HttpGet("AllRead")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllead ()
        {
            var result = await _IContactService.GetAllReadAsync();
            return Ok(result);
        }
        [HttpPost("SendContact")]
        public async Task<IActionResult> SendContact(SendContactRequest request)
        {
            var result = await _IContactService.SendContactAsync(request);
            return Ok(result);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _IContactService.DeleteSendcontactAsync(id);

            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy liên hệ để xóa." });
            }

            return Ok(new { message = "Xóa liên hệ thành công." });
        }
        [HttpPut("read/{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Read(int id)
        {
            var result = await _IContactService.ReadContactAsync(id);

            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy liên hệ" });
            }

            return Ok(result);
        }
    }

}