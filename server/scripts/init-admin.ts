import "dotenv/config";
import bcrypt from "bcrypt";
import { createAdmin, getDB, closeDB } from "../db";

/**
 * Initialize database with a default admin user
 * Username: admin
 * Password: password (change this after first login!)
 */
async function initializeAdmin() {
  try {
    console.log("Initializing admin user...");

    const username = "admin";
    const password = "password";

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create admin user
    const [admin] = await createAdmin(username, password_hash);

    console.log("✅ Admin user created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    await closeDB();
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

initializeAdmin();
