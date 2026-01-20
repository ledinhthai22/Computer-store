using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumnTrangThai : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "ThuongHieu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$e7fimDyiFL4M/U6gS9AI7eatbayAYkPxurHt9YmRe8Ph41b.IlQaO", new DateTime(2026, 1, 20, 10, 35, 18, 520, DateTimeKind.Local).AddTicks(5260), new DateTime(2026, 1, 20, 10, 35, 18, 520, DateTimeKind.Local).AddTicks(5241) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "ThuongHieu");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$DT9CddSYKZpLjeo6KdnEPe8ShPQCPxTvy.2Rti1VKbYaVrFyJv9Ye", new DateTime(2026, 1, 19, 16, 37, 1, 167, DateTimeKind.Local).AddTicks(4604), new DateTime(2026, 1, 19, 16, 37, 1, 167, DateTimeKind.Local).AddTicks(4583) });
        }
    }
}
