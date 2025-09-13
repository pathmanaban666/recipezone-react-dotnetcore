using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeWebApp.Migrations
{
    /// <inheritdoc />
    public partial class recipevault : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeVault_AspNetUsers_UserId",
                table: "RecipeVault");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeVault",
                table: "RecipeVault");

            migrationBuilder.RenameTable(
                name: "RecipeVault",
                newName: "RecipeVaults");

            migrationBuilder.RenameColumn(
                name: "RecipeInfo",
                table: "RecipeVaults",
                newName: "Instructions");

            migrationBuilder.RenameIndex(
                name: "IX_RecipeVault_UserId",
                table: "RecipeVaults",
                newName: "IX_RecipeVaults_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeVaults",
                table: "RecipeVaults",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeVaults_AspNetUsers_UserId",
                table: "RecipeVaults",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeVaults_AspNetUsers_UserId",
                table: "RecipeVaults");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeVaults",
                table: "RecipeVaults");

            migrationBuilder.RenameTable(
                name: "RecipeVaults",
                newName: "RecipeVault");

            migrationBuilder.RenameColumn(
                name: "Instructions",
                table: "RecipeVault",
                newName: "RecipeInfo");

            migrationBuilder.RenameIndex(
                name: "IX_RecipeVaults_UserId",
                table: "RecipeVault",
                newName: "IX_RecipeVault_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeVault",
                table: "RecipeVault",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeVault_AspNetUsers_UserId",
                table: "RecipeVault",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
