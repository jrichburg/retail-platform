using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_products_upc",
                table: "products");

            // Migrate existing UPCs into product_variants before dropping the column
            // (product_variants table must be created first — see below, this SQL runs after table creation)

            migrationBuilder.AddColumn<string>(
                name: "color",
                table: "products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "map_date",
                table: "products",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "size_grid_id",
                table: "products",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "supplier_id",
                table: "products",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "product_variants",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    dimension1_value = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    dimension2_value = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    upc = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_variants", x => x.id);
                    table.ForeignKey(
                        name: "FK_product_variants_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "size_grids",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    dimension1_label = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    dimension2_label = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_size_grids", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "suppliers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_suppliers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "size_grid_values",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    size_grid_id = table.Column<Guid>(type: "uuid", nullable: false),
                    dimension = table.Column<int>(type: "integer", nullable: false),
                    value = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_size_grid_values", x => x.id);
                    table.ForeignKey(
                        name: "FK_size_grid_values_size_grids_size_grid_id",
                        column: x => x.size_grid_id,
                        principalTable: "size_grids",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Migrate existing UPCs from products into product_variants as default variants
            migrationBuilder.Sql(@"
                INSERT INTO product_variants (id, tenant_node_id, root_tenant_id, product_id, dimension1_value, dimension2_value, upc, is_active, created_at, updated_at)
                SELECT gen_random_uuid(), tenant_node_id, root_tenant_id, id, NULL, NULL, upc, is_active, NOW(), NOW()
                FROM products
                WHERE upc IS NOT NULL
            ");

            // Now drop the upc column from products
            migrationBuilder.DropColumn(
                name: "upc",
                table: "products");

            migrationBuilder.CreateIndex(
                name: "IX_products_size_grid_id",
                table: "products",
                column: "size_grid_id");

            migrationBuilder.CreateIndex(
                name: "IX_products_supplier_id",
                table: "products",
                column: "supplier_id");

            migrationBuilder.CreateIndex(
                name: "ix_product_variants_product_dims",
                table: "product_variants",
                columns: new[] { "product_id", "dimension1_value", "dimension2_value" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_product_variants_tenant_upc",
                table: "product_variants",
                columns: new[] { "root_tenant_id", "upc" },
                unique: true,
                filter: "upc IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_product_variants_upc",
                table: "product_variants",
                column: "upc");

            migrationBuilder.CreateIndex(
                name: "ix_size_grid_values_order",
                table: "size_grid_values",
                columns: new[] { "size_grid_id", "dimension", "sort_order" });

            migrationBuilder.CreateIndex(
                name: "ix_size_grid_values_unique",
                table: "size_grid_values",
                columns: new[] { "size_grid_id", "dimension", "value" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_size_grids_tenant_name",
                table: "size_grids",
                columns: new[] { "root_tenant_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_suppliers_tenant_code",
                table: "suppliers",
                columns: new[] { "root_tenant_id", "code" },
                unique: true,
                filter: "code IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ix_suppliers_tenant_name",
                table: "suppliers",
                columns: new[] { "root_tenant_id", "name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_products_size_grids_size_grid_id",
                table: "products",
                column: "size_grid_id",
                principalTable: "size_grids",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_products_suppliers_supplier_id",
                table: "products",
                column: "supplier_id",
                principalTable: "suppliers",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_products_size_grids_size_grid_id",
                table: "products");

            migrationBuilder.DropForeignKey(
                name: "FK_products_suppliers_supplier_id",
                table: "products");

            migrationBuilder.DropTable(
                name: "product_variants");

            migrationBuilder.DropTable(
                name: "size_grid_values");

            migrationBuilder.DropTable(
                name: "suppliers");

            migrationBuilder.DropTable(
                name: "size_grids");

            migrationBuilder.DropIndex(
                name: "IX_products_size_grid_id",
                table: "products");

            migrationBuilder.DropIndex(
                name: "IX_products_supplier_id",
                table: "products");

            migrationBuilder.DropColumn(
                name: "map_date",
                table: "products");

            migrationBuilder.DropColumn(
                name: "size_grid_id",
                table: "products");

            migrationBuilder.DropColumn(
                name: "supplier_id",
                table: "products");

            migrationBuilder.DropColumn(
                name: "color",
                table: "products");

            migrationBuilder.AddColumn<string>(
                name: "upc",
                table: "products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_products_upc",
                table: "products",
                column: "upc");
        }
    }
}
