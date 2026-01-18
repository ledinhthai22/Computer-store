using Microsoft.AspNetCore.Mvc;
using Backend.Services.WebInfo;
using Backend.DTO.WebInfo;
using Ecommerce.DTO.WebInfo;

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
    }
}
