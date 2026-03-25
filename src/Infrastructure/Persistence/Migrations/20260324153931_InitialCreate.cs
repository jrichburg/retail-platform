using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Enable required PostgreSQL extensions
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";");
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS \"ltree\";");

            migrationBuilder.CreateTable(
                name: "tenant_nodes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    root_tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    parent_id = table.Column<Guid>(type: "uuid", nullable: true),
                    node_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    path = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    depth = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_nodes", x => x.id);
                    table.ForeignKey(
                        name: "FK_tenant_nodes_tenant_nodes_parent_id",
                        column: x => x.parent_id,
                        principalTable: "tenant_nodes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tenant_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_node_id = table.Column<Guid>(type: "uuid", nullable: false),
                    settings_key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    settings_value = table.Column<string>(type: "jsonb", nullable: false),
                    is_locked = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_settings", x => x.id);
                    table.ForeignKey(
                        name: "FK_tenant_settings_tenant_nodes_tenant_node_id",
                        column: x => x.tenant_node_id,
                        principalTable: "tenant_nodes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tenant_nodes_parent_id",
                table: "tenant_nodes",
                column: "parent_id");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_nodes_path",
                table: "tenant_nodes",
                column: "path");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_nodes_root",
                table: "tenant_nodes",
                column: "root_tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_settings_node_key",
                table: "tenant_settings",
                columns: new[] { "tenant_node_id", "settings_key" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tenant_settings");

            migrationBuilder.DropTable(
                name: "tenant_nodes");
        }
    }
}
