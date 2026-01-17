using Microsoft.AspNetCore.Mvc;
using Backend.Services.WebInfo;
using Backend.DTO.WebInfo;

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
        public async Task<IActionResult> GetActiveAsync()
        {
            var result = await _webInfoService.GetActiveAsync();
            return Ok(result);
        }
    }
}
