using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVariantToInventoryAndSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "product_variant_id",
                table: "stock_transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "product_variant_id",
                table: "stock_levels",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "product_variant_id",
                table: "sale_line_items",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "variant_description",
                table: "sale_line_items",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "product_variant_id",
                table: "stock_transactions");

            migrationBuilder.DropColumn(
                name: "product_variant_id",
                table: "stock_levels");

            migrationBuilder.DropColumn(
                name: "product_variant_id",
                table: "sale_line_items");

            migrationBuilder.DropColumn(
                name: "variant_description",
                table: "sale_line_items");
        }
    }
}
