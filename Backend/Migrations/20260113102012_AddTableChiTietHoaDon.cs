using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddTableChiTietHoaDon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietDonHang_BienThe_MaBienThe",
                table: "ChiTietDonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$5u1jQnvt0t7f7ssw7zCB/.XeHY8bTkVvVB2v38SkQjIIP4MZ6twD2", new DateTime(2026, 1, 13, 17, 20, 9, 959, DateTimeKind.Local).AddTicks(4426), new DateTime(2026, 1, 13, 17, 20, 9, 959, DateTimeKind.Local).AddTicks(4408) });

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietDonHang_BienThe_MaBienThe",
                table: "ChiTietDonHang",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietDonHang_BienThe_MaBienThe",
                table: "ChiTietDonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$d869L3PzSwRrH8MsHTUCwOEM89Q7Bt.yl4dBGiH.LpZ1VYnNU7zEi", new DateTime(2026, 1, 13, 9, 59, 59, 7, DateTimeKind.Local).AddTicks(5896), new DateTime(2026, 1, 13, 9, 59, 59, 7, DateTimeKind.Local).AddTicks(5880) });

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietDonHang_BienThe_MaBienThe",
                table: "ChiTietDonHang",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
