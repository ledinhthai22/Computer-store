using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.DTO.Wishlist
{
    public class Wishlist : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
