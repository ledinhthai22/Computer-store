using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumsIsDeleteLienHe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Is_Delete",
                table: "DanhMuc",
                type: "datetime2",
                nullable: true
                );

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$cHBK2DkngvpaFmiHRH70DeP7vTLm2TOr2OLX7oUsizC23P01jlz1i", new DateTime(2026, 1, 6, 22, 46, 21, 595, DateTimeKind.Local).AddTicks(5664), new DateTime(2026, 1, 6, 22, 46, 21, 595, DateTimeKind.Local).AddTicks(5640) });
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
                values: new object[] { "$2a$11$KswzvzDX3o3kRZ5waNWzqew250SLBaN9aRl2kotRcTgSfLGn4OAvy", new DateTime(2026, 1, 6, 22, 43, 47, 951, DateTimeKind.Local).AddTicks(9417), new DateTime(2026, 1, 6, 22, 43, 47, 951, DateTimeKind.Local).AddTicks(9394) });
        }
    }
}
