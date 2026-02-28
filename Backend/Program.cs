using System.Text;
using Backend.Data;
using Backend.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Backend.Services.Auth;
using Backend.Services.Category;
using Backend.Services.Brand;
using Backend.Services.WishList;
using Backend.Services.Contact;
using Backend.Services.WebInfo;
using Backend.Services.Cart;
using Backend.Services.File;
using Backend.Services.User;
using Backend.Services.Order;
using Backend.Services.Statistics;
using Backend.Services.Search;
using Ecommerce.Services.DeliveryAddress;
using Ecommerce.Services.Product;
using Ecommerce.Services.SlideShow;
namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddScoped<Backend.Helper.JwtHelper>();
            builder.Services.AddScoped<Backend.Helper.SlugHelper>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IBrandService, BrandService>();
            builder.Services.AddScoped<IWishListService, WishListService>();
            builder.Services.AddScoped<IContactService, ContactService>();
            builder.Services.AddScoped<IWebInfoService, WebInfoService>();
            builder.Services.AddScoped<ICartService, CartService>();
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<IFileService, FileService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IStatisticsService, StatisticsService>();
            builder.Services.AddScoped<ISearchService, SearchService>();
            builder.Services.AddScoped<ISlideShowService,SlideShowService>();
            builder.Services.AddControllers();
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var jwtKey = jwtSettings["Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT 'Key' is not configured in appsettings.");
            }
            var key = Encoding.UTF8.GetBytes(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["access_token"];
                        return Task.CompletedTask;
                    }
                };
            });
            builder.Services.AddHttpClient<IDeliveryAddress, DeliveryAddressService>();
            builder.Services.Configure<ProvinceOptions>(
                builder.Configuration.GetSection("ExternalApis:Provinces"));
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "Ecommerce API", Version = "v1" });

                // c.AddSecurityDefinition("Bearer", new()
                // {
                //     Name = "Authorization",
                //     Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                //     Scheme = "Bearer",
                //     BearerFormat = "JWT",
                //     In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                //     Description = "Nhập: Bearer {token}"
                // });

                // c.AddSecurityRequirement(new()
                // {
                //     {
                //         new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                //         {
                //             Reference = new Microsoft.OpenApi.Models.OpenApiReference
                //             {
                //                 Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                //                 Id = "Bearer"
                //             }
                //         },
                //         new string[] {}
                //     }
                // });

            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:3000",    //port cho react dựa trên create-react-app mặc định
                            "http://localhost:5173"     //port cho react dựa trên vitejs mặc định
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            var conStr = builder.Configuration.GetConnectionString("DefaultConnect");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(conStr);
            });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly",
                    policy => policy.RequireRole("QuanTriVien"));

                options.AddPolicy("UserOnly",
                    policy => policy.RequireRole("NguoiDung"));
            });
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(60);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;

                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });
            var app = builder.Build();
            app.UseSession();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                

            }
            app.UseCors("AllowReact");
            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseRequestLogging();

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();
            app.Urls.Add("http://0.0.0.0:10000");
            app.Run();
        }
    }
}
