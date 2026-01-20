using Microsoft.AspNetCore.Mvc;
using Backend.Services.WebInfo;

namespace Ecommerce.Controller.Client.Public
{
    [Route("api/webinfo")]
    [ApiController]
    public class WebInfoController : ControllerBase
    {
        private readonly IWebInfoService _webInfoService;
        public WebInfoController(IWebInfoService webInfoService)
        {
            _webInfoService = webInfoService;
        }
        [HttpGet]
        public async Task<IActionResult> GetForClient()
        {
            return Ok(await _webInfoService.GetForClientAsync());
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _webInfoService.GetAllAsync();
            return Ok(data);
        }
    }
}
