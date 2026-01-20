using Backend.Data;
using Ecommerce.Services.SlideShow;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controller.Client.Public
{
    [ApiController]
    [Route("api/SlideShow")]
    public class SlideShowController : ControllerBase
    {
        private readonly ISlideShowService _ISlideShow;
        public SlideShowController(ISlideShowService ISlideShow)
        {
            _ISlideShow = ISlideShow;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _ISlideShow.GetAllAsync();
            return Ok(result);
        }
    }
}
