using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCollumsIsDeleteDanhMuc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Is_Delete",
                table: "DanhMuc");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$SuN6RxSf4PpMjyDEv74pZeK1Z3saYb2xhXVn7rfh/Df6SJAJXUdca", new DateTime(2026, 1, 6, 22, 55, 19, 26, DateTimeKind.Local).AddTicks(2282), new DateTime(2026, 1, 6, 22, 55, 19, 26, DateTimeKind.Local).AddTicks(2262) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Is_Delete",
                table: "DanhMuc",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$dKUp4Rrl0a47WnGNWeSfRunzk4SX4L8OouXI41vWCQ8OwsK1O9LAu", new DateTime(2026, 1, 6, 22, 52, 44, 864, DateTimeKind.Local).AddTicks(723), new DateTime(2026, 1, 6, 22, 52, 44, 864, DateTimeKind.Local).AddTicks(707) });
        }
    }
}
