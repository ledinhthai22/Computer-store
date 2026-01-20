using Ecommerce.DTO.SlideShow;
using Ecommerce.Services.SlideShow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Admin.SlideShow
{
    [ApiController]
    [Route("api/admin/SlideShow")]
    [Authorize(Roles = "QuanTriVien")]
    public class SlideShowController : ControllerBase
    {
        private readonly ISlideShowService _ISlideShow;
        public SlideShowController(ISlideShowService iSlideShow)
        {
            _ISlideShow = iSlideShow;
        }
        [HttpGet]
        public async Task<IActionResult> GetAdminAll()
        {
            var result = await _ISlideShow.GetAllAdminAsync();
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] SlideShowCreate request)
        {
            await _ISlideShow.CreateAsync(request);
            return Ok("Thêm slideshow thành công");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateSlideShow request)
        {
            var success = await _ISlideShow.UpdateAsync(id, request);
            if (!success) return NotFound();
            return Ok("Cập nhật thành công");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _ISlideShow.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok("Xóa thành công");
        }
    }
}
