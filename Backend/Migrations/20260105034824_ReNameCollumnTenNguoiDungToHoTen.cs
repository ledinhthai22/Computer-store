using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class ReNameCollumnTenNguoiDungToHoTen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$.WOtuIbf.34eZrATztvRN.6YPktm4csxnT2Xsm7rxFZBjLy9DX4oe", new DateTime(2026, 1, 5, 10, 48, 23, 235, DateTimeKind.Local).AddTicks(3970), new DateTime(2026, 1, 5, 10, 48, 23, 235, DateTimeKind.Local).AddTicks(3950) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$ze8YJEy1lpHHsk8OL08znOVFrfrt9PMPurBgCPS9N7vkpt3LeDmya", new DateTime(2026, 1, 4, 18, 56, 49, 58, DateTimeKind.Local).AddTicks(3244), new DateTime(2026, 1, 4, 18, 56, 49, 58, DateTimeKind.Local).AddTicks(3223) });
        }
    }
}
