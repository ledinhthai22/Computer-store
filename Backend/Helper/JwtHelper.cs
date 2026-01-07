using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Helper
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public string GenerateToken(int userId, string role)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var keyString = jwtSettings["Key"];
            if (string.IsNullOrEmpty(keyString))
                throw new InvalidOperationException("JWT Key is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            double expiresMinutes = 60;
            if (double.TryParse(jwtSettings["ExpiresMinutes"], out double parsed))
                expiresMinutes = parsed;

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public string GenerateRefreshToken(int userId)
        {
            var refreshKey = _configuration["Jwt:RefreshKey"];
            if (string.IsNullOrEmpty(refreshKey))
                throw new InvalidOperationException("JWT Refresh Key is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(refreshKey));

            var claims = new[]
            {
                new Claim("userId", userId.ToString()),
                new Claim("type", "refresh")
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal ValidateRefreshToken(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new ArgumentException("Refresh token is empty.");

            var refreshKey = _configuration["Jwt:RefreshKey"];
            if (string.IsNullOrEmpty(refreshKey))
                throw new InvalidOperationException("JWT Refresh Key is not configured.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(refreshKey);

            var validationParams = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(
                refreshToken,
                validationParams,
                out SecurityToken validatedToken
            );


            if (validatedToken is not JwtSecurityToken jwt ||
                !jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.OrdinalIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token algorithm");
            }
            
            var tokenType = principal.FindFirst("type")?.Value;
            if (tokenType != "refresh")
            {
                throw new SecurityTokenException("Invalid refresh token type");
            }

            return principal;
        }
    }
}
