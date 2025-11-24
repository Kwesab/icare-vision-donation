import "dotenv/config";
import fs from "fs";
import path from "path";
import { getDB, closeDB } from "../db";

/**
 * Set up database schema by running the SQL file
 */
async function setupDatabase() {
  try {
    console.log("📦 Setting up database schema...");

    // Read the schema SQL file
    const schemaPath = path.join(process.cwd(), "server", "db", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // Get database connection
    const db = await getDB();

    // Execute the schema SQL
    await db.unsafe(schemaSql);

    console.log("✅ Database schema created successfully!");
    console.log("\nTables created:");
    console.log("  - donations");
    console.log("  - admin_users");
    console.log("\n📝 Next step: Run 'pnpm init-admin' to create your admin user");

    await closeDB();
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
