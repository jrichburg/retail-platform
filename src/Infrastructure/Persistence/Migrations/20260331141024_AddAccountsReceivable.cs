using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountsReceivable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ar_invoices",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    invoice_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    customer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    customer_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    source_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    source_id = table.Column<Guid>(type: "uuid", nullable: true),
                    source_reference = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    invoice_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    amount_paid = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    balance_due = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ar_invoices", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ar_payments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    payment_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    invoice_id = table.Column<Guid>(type: "uuid", nullable: false),
                    customer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    payment_method = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    payment_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reference = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ar_payments", x => x.id);
                    table.ForeignKey(
                        name: "FK_ar_payments_ar_invoices_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "ar_invoices",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_ar_invoices_customer",
                table: "ar_invoices",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "ix_ar_invoices_number",
                table: "ar_invoices",
                column: "invoice_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_ar_invoices_source",
                table: "ar_invoices",
                columns: new[] { "source_type", "source_id" });

            migrationBuilder.CreateIndex(
                name: "ix_ar_invoices_tenant_status",
                table: "ar_invoices",
                columns: new[] { "tenant_node_id", "status" });

            migrationBuilder.CreateIndex(
                name: "ix_ar_payments_customer",
                table: "ar_payments",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "ix_ar_payments_invoice",
                table: "ar_payments",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "ix_ar_payments_number",
                table: "ar_payments",
                column: "payment_number",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ar_payments");

            migrationBuilder.DropTable(
                name: "ar_invoices");
        }
    }
}
