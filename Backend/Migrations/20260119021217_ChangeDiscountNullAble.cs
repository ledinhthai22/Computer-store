using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDiscountNullAble : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GiaKhuyenMai",
                table: "BienThe",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$XZ4QDRAM5jmkOPmVZKtrNeti5L/XWZ0qMI4vhhckn3VTgBCx02biu", new DateTime(2026, 1, 19, 9, 12, 16, 367, DateTimeKind.Local).AddTicks(2462), new DateTime(2026, 1, 19, 9, 12, 16, 367, DateTimeKind.Local).AddTicks(2434) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GiaKhuyenMai",
                table: "BienThe",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$1syk/9Jcn6.WLqhK44rNm.9x9HIOY94wEjPheW1hyUO4XAk4lCmtq", new DateTime(2026, 1, 18, 19, 54, 57, 842, DateTimeKind.Local).AddTicks(7645), new DateTime(2026, 1, 18, 19, 54, 57, 842, DateTimeKind.Local).AddTicks(7621) });
        }
    }
}
