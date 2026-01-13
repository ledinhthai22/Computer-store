using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Init_Product_Variant_Spec : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$5pB38tqdJMdUil0nxEziPuvCG5qaas1tBwtePHzURJawpcj1fth2u", new DateTime(2026, 1, 13, 8, 45, 45, 436, DateTimeKind.Local).AddTicks(635), new DateTime(2026, 1, 13, 8, 45, 45, 436, DateTimeKind.Local).AddTicks(616) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Lj4RxR3KqMABFvhrh3cB1O.ZMNS29PYMWkM9JmRPBFETyrxcTGyIi", new DateTime(2026, 1, 13, 8, 30, 43, 374, DateTimeKind.Local).AddTicks(2562), new DateTime(2026, 1, 13, 8, 30, 43, 374, DateTimeKind.Local).AddTicks(2543) });
        }
    }
}
