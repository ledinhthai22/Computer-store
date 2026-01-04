using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Update_DiaChiNhanHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Tinh",
                table: "DiaChiNhanHang",
                newName: "TinhThanh");
             migrationBuilder.RenameColumn(
                name: "Thuong",
                table: "DiaChiNhanHang",
                newName: "PhuongXa");
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$BWRltWrH2Wr44M3qErJ9hOMWX5VCLbM6pAP0Gs8GE93a4NHgQBTm.", new DateTime(2026, 1, 4, 17, 55, 18, 97, DateTimeKind.Local).AddTicks(3288), new DateTime(2026, 1, 4, 17, 55, 18, 97, DateTimeKind.Local).AddTicks(3268) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TinhThanh",
                table: "DiaChiNhanHang",
                newName: "Tinh");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$IyvmhWQPmOZVbfFIkpketeU.U99N5.TxA8L1ZcqErTaR1j/GWIPXW", new DateTime(2026, 1, 4, 17, 51, 26, 437, DateTimeKind.Local).AddTicks(8056), new DateTime(2026, 1, 4, 17, 51, 26, 437, DateTimeKind.Local).AddTicks(8032) });
        }
    }
}
