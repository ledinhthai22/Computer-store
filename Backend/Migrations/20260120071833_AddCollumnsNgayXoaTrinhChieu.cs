using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumnsNgayXoaTrinhChieu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "TrinhChieu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$k/BvXBeOMwqxoJwy4/nWeO9xCEjY.1uhHFzaLZUxxNpkyEHL.YEpm", new DateTime(2026, 1, 20, 14, 18, 31, 961, DateTimeKind.Local).AddTicks(5089), new DateTime(2026, 1, 20, 14, 18, 31, 961, DateTimeKind.Local).AddTicks(5065) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "TrinhChieu");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$e7fimDyiFL4M/U6gS9AI7eatbayAYkPxurHt9YmRe8Ph41b.IlQaO", new DateTime(2026, 1, 20, 10, 35, 18, 520, DateTimeKind.Local).AddTicks(5260), new DateTime(2026, 1, 20, 10, 35, 18, 520, DateTimeKind.Local).AddTicks(5241) });
        }
    }
}
