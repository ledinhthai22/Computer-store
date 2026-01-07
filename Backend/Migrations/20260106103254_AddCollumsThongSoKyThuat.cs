using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumsThongSoKyThuat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CongGiaoTiep",
                table: "ThongSoKyThuat",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoaiXuLyDoHoa",
                table: "ThongSoKyThuat",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoaiXuLyTrungTam",
                table: "ThongSoKyThuat",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Deleted_At",
                table: "BienThe",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$QCUclOyu2Av9du89r1FNQuO1WWXOgqF/Syct2nhb5reVqTRVe.yVC", new DateTime(2026, 1, 6, 17, 32, 53, 780, DateTimeKind.Local).AddTicks(1286), new DateTime(2026, 1, 6, 17, 32, 53, 780, DateTimeKind.Local).AddTicks(1267) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CongGiaoTiep",
                table: "ThongSoKyThuat");

            migrationBuilder.DropColumn(
                name: "LoaiXuLyDoHoa",
                table: "ThongSoKyThuat");

            migrationBuilder.DropColumn(
                name: "LoaiXuLyTrungTam",
                table: "ThongSoKyThuat");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Deleted_At",
                table: "BienThe",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$csXVERdbSuz4ylVt4C5aoODIT8o589ScoVNviDs8TmHz3UbUzJbzi", new DateTime(2026, 1, 6, 17, 4, 25, 404, DateTimeKind.Local).AddTicks(9227), new DateTime(2026, 1, 6, 17, 4, 25, 404, DateTimeKind.Local).AddTicks(9204) });
        }
    }
}
