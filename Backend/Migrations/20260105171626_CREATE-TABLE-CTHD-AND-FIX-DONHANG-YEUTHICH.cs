using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class CREATETABLECTHDANDFIXDONHANGYEUTHICH : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonHang_BienThe_MaBienThe",
                table: "DonHang");

            migrationBuilder.DropIndex(
                name: "IX_DonHang_MaBienThe",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "MaBienThe",
                table: "DonHang");

            migrationBuilder.AddColumn<DateTime>(
                name: "Deleted_At",
                table: "YeuThich",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "BienTheMaBTSP",
                table: "DonHang",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "DonHang",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "ChiTietDonHang",
                columns: table => new
                {
                    MaDonHang = table.Column<int>(type: "int", nullable: false),
                    MaBienThe = table.Column<int>(type: "int", nullable: false),
                    MaCTDH = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDonHang", x => new { x.MaDonHang, x.MaBienThe });
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_BienThe_MaBienThe",
                        column: x => x.MaBienThe,
                        principalTable: "BienThe",
                        principalColumn: "MaBTSP",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_DonHang_MaDonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonHang",
                        principalColumn: "MaDH",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$R2lrMeGHBIRESeJYLQ3bcuZBvn.LPIa9jrW66rpJldJagCv6nGqmO", new DateTime(2026, 1, 6, 0, 16, 23, 691, DateTimeKind.Local).AddTicks(9599), new DateTime(2026, 1, 6, 0, 16, 23, 691, DateTimeKind.Local).AddTicks(9584) });

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_BienTheMaBTSP",
                table: "DonHang",
                column: "BienTheMaBTSP");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDonHang_MaBienThe",
                table: "ChiTietDonHang",
                column: "MaBienThe");

            migrationBuilder.AddForeignKey(
                name: "FK_DonHang_BienThe_BienTheMaBTSP",
                table: "DonHang",
                column: "BienTheMaBTSP",
                principalTable: "BienThe",
                principalColumn: "MaBTSP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonHang_BienThe_BienTheMaBTSP",
                table: "DonHang");

            migrationBuilder.DropTable(
                name: "ChiTietDonHang");

            migrationBuilder.DropIndex(
                name: "IX_DonHang_BienTheMaBTSP",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "Deleted_At",
                table: "YeuThich");

            migrationBuilder.DropColumn(
                name: "BienTheMaBTSP",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "DonHang");

            migrationBuilder.AddColumn<int>(
                name: "MaBienThe",
                table: "DonHang",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$wL6i3Ru064VEIJRUFOsST.BeLAEXVtMhWC51DG6omDofdeG1nxks2", new DateTime(2026, 1, 5, 15, 3, 39, 376, DateTimeKind.Local).AddTicks(3447), new DateTime(2026, 1, 5, 15, 3, 39, 376, DateTimeKind.Local).AddTicks(3424) });

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaBienThe",
                table: "DonHang",
                column: "MaBienThe");

            migrationBuilder.AddForeignKey(
                name: "FK_DonHang_BienThe_MaBienThe",
                table: "DonHang",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
