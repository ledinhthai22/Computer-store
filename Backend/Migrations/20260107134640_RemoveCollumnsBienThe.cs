using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCollumnsBienThe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManHinh",
                table: "BienThe");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$mOn1kVjTmsIPvZCyIr6qmuoYKJknAIDVIc6ff79unCdn9PmBTQqlm", new DateTime(2026, 1, 7, 20, 46, 40, 486, DateTimeKind.Local).AddTicks(3791), new DateTime(2026, 1, 7, 20, 46, 40, 486, DateTimeKind.Local).AddTicks(3767) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ManHinh",
                table: "BienThe",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$XsnWJdMkBCh/6j7I9BPoWeZwbAmA3H6lxRvjfzxMAgUyD.VpYKF2i", new DateTime(2026, 1, 7, 14, 26, 38, 802, DateTimeKind.Local).AddTicks(2962), new DateTime(2026, 1, 7, 14, 26, 38, 802, DateTimeKind.Local).AddTicks(2943) });
        }
    }
}
