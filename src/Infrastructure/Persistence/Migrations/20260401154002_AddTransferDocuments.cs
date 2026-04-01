using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTransferDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "transfer_documents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    document_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    source_tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    destination_tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
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
                    table.PrimaryKey("PK_transfer_documents", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "transfer_document_lines",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    transfer_document_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_variant_id = table.Column<Guid>(type: "uuid", nullable: true),
                    product_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    sku = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    upc = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    variant_description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transfer_document_lines", x => x.id);
                    table.ForeignKey(
                        name: "FK_transfer_document_lines_transfer_documents_transfer_documen~",
                        column: x => x.transfer_document_id,
                        principalTable: "transfer_documents",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_transfer_document_lines_document",
                table: "transfer_document_lines",
                column: "transfer_document_id");

            migrationBuilder.CreateIndex(
                name: "ix_transfer_documents_number",
                table: "transfer_documents",
                column: "document_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_transfer_documents_status",
                table: "transfer_documents",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_transfer_documents_tenant_date",
                table: "transfer_documents",
                columns: new[] { "tenant_node_id", "created_at" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "transfer_document_lines");

            migrationBuilder.DropTable(
                name: "transfer_documents");
        }
    }
}
