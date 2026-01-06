using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace Backend.Helper
{
    public static class JwtParser
    {
        public static string GetUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
            return userId;
        }
    }
}
