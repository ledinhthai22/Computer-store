using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Is_Delete",
                table: "SanPham",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$mGTQxUhZBERPEJDSKZt/5.RJ5FS15XcvmoA3UJQDN/DibuTU.P9PK", new DateTime(2026, 1, 6, 23, 30, 29, 364, DateTimeKind.Local).AddTicks(5450), new DateTime(2026, 1, 6, 23, 30, 29, 364, DateTimeKind.Local).AddTicks(5430) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Is_Delete",
                table: "SanPham");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$RWubdK/soQ6y7Df9acTQBefquOeeAKNG/1eQvQVe3OuCUvKB75P5q", new DateTime(2026, 1, 6, 22, 56, 2, 688, DateTimeKind.Local).AddTicks(6983), new DateTime(2026, 1, 6, 22, 56, 2, 688, DateTimeKind.Local).AddTicks(6965) });
        }
    }
}
