using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "work_orders",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    order_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    customer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    customer_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    customer_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    customer_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    total_amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_work_orders", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "work_order_lines",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    work_order_id = table.Column<Guid>(type: "uuid", nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    product_variant_id = table.Column<Guid>(type: "uuid", nullable: true),
                    product_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    sku = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    unit_price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_work_order_lines", x => x.id);
                    table.ForeignKey(
                        name: "FK_work_order_lines_work_orders_work_order_id",
                        column: x => x.work_order_id,
                        principalTable: "work_orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_work_order_lines_order",
                table: "work_order_lines",
                column: "work_order_id");

            migrationBuilder.CreateIndex(
                name: "ix_work_orders_customer",
                table: "work_orders",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "ix_work_orders_number",
                table: "work_orders",
                column: "order_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_work_orders_tenant_status",
                table: "work_orders",
                columns: new[] { "tenant_node_id", "status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "work_order_lines");

            migrationBuilder.DropTable(
                name: "work_orders");
        }
    }
}
