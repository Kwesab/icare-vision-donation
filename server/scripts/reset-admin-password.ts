import "dotenv/config";
import bcrypt from "bcryptjs";
import { getDB, closeDB } from "../db";

/**
 * Reset admin password
 */
async function resetAdminPassword() {
  try {
    console.log("🔄 Resetting admin password...");

    const username = "admin";
    const newPassword = "password";

    // Hash the new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update admin user
    const db = await getDB();
    await db`
      UPDATE admin_users 
      SET password_hash = ${password_hash}
      WHERE username = ${username}
    `;

    console.log("✅ Admin password reset successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${newPassword}`);
    console.log("\n⚠️  IMPORTANT: Change this password after logging in!");

    await closeDB();
  } catch (error) {
    console.error("❌ Error resetting admin password:", error);
    process.exit(1);
  }
}

resetAdminPassword();
