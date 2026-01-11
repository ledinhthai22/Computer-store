using Backend.Services.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/contacts")]
    [Authorize(Policy = "AdminOnly")]
    public class ContactAdminController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactAdminController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // GET /api/admin/contacts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _contactService.GetAllAsync();
            return Ok(result);
        }

        // GET /api/admin/contacts/unread
        [HttpGet("unread")]
        public async Task<IActionResult> GetAllUnread()
        {
            var result = await _contactService.GetAllUnreadAsync();
            return Ok(result);
        }

        // GET /api/admin/contacts/read
        [HttpGet("read")]
        public async Task<IActionResult> GetAllRead()
        {
            var result = await _contactService.GetAllReadAsync();
            return Ok(result);
        }

        // PUT /api/admin/contacts/read/{id}
        [HttpPut("read/{id:int}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _contactService.ReadContactAsync(id);

            if (result == null)
                return NotFound(new { message = "Không tìm thấy liên hệ" });

            return Ok(new { message = "Đã đánh dấu là đã đọc" });
        }

        // DELETE /api/admin/contacts/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _contactService.DeleteSendcontactAsync(id);

            if (!success)
                return NotFound(new { message = "Không tìm thấy liên hệ để xóa" });

            return Ok(new { message = "Xóa liên hệ thành công" });
        }
    }
}
