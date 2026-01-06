using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumsIsDeleteDanhMuc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                values: new object[] { "$2a$11$RWubdK/soQ6y7Df9acTQBefquOeeAKNG/1eQvQVe3OuCUvKB75P5q", new DateTime(2026, 1, 6, 22, 56, 2, 688, DateTimeKind.Local).AddTicks(6983), new DateTime(2026, 1, 6, 22, 56, 2, 688, DateTimeKind.Local).AddTicks(6965) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
