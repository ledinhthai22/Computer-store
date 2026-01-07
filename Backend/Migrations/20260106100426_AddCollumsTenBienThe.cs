using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumsTenBienThe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Deleted_At",
                table: "BienThe",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenBienThe",
                table: "BienThe",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$csXVERdbSuz4ylVt4C5aoODIT8o589ScoVNviDs8TmHz3UbUzJbzi", new DateTime(2026, 1, 6, 17, 4, 25, 404, DateTimeKind.Local).AddTicks(9227), new DateTime(2026, 1, 6, 17, 4, 25, 404, DateTimeKind.Local).AddTicks(9204) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted_At",
                table: "BienThe");

            migrationBuilder.DropColumn(
                name: "TenBienThe",
                table: "BienThe");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$PrRp08.PKgq45bi6ItiJKeCB0a/M45aK6gJA8XK7y3WzhlaTEwOL.", new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9546), new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9528) });
        }
    }
}
