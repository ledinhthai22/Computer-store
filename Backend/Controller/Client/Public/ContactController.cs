using Backend.DTO.Contact;
using Backend.Services.Contact;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Client.Public
{
    [ApiController]
    [Route("api/contacts")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // POST /api/contacts
        [HttpPost]
        public async Task<IActionResult> SendContact(
            [FromBody] SendContactRequest request)
        {
            var result = await _contactService.SendContactAsync(request);
            return Ok(new
            {
                message = "Gửi liên hệ thành công",
                data = result
            });
        }
    }
}
