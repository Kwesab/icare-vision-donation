import postgres from 'postgres';

let sql: ReturnType<typeof postgres> | null = null;

/**
 * Get database connection
 * Initializes connection pool on first call
 */
export async function getDB() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    sql = postgres(connectionString);
  }

  return sql;
}

/**
 * Close database connection
 * Call this during graceful shutdown
 */
export async function closeDB() {
  if (sql) {
    await sql.end();
    sql = null;
  }
}

/**
 * Get all donations (admin view - includes amounts)
 */
export async function getAllDonations() {
  const db = await getDB();
  return db`SELECT * FROM donations ORDER BY created_at DESC`;
}

/**
 * Get public donors (excludes amounts)
 */
export async function getPublicDonors() {
  const db = await getDB();
  return db`
    SELECT id, donor_name, message, payment_type, created_at 
    FROM donations 
    WHERE status = 'completed'
    ORDER BY created_at DESC
  `;
}

/**
 * Create a new donation record
 */
export async function createDonation(
  donor_name: string,
  donor_email: string,
  amount: number,
  message: string | null,
  payment_type: 'online' | 'cash',
  paystack_reference?: string
) {
  const db = await getDB();
  return db`
    INSERT INTO donations (donor_name, donor_email, amount, message, payment_type, paystack_reference, status)
    VALUES (${donor_name}, ${donor_email}, ${amount}, ${message}, ${payment_type}, ${paystack_reference || null}, 'completed')
    RETURNING *
  `;
}

/**
 * Update donation status
 */
export async function updateDonationStatus(
  id: number,
  status: 'pending' | 'completed' | 'failed'
) {
  const db = await getDB();
  return db`
    UPDATE donations 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
}

/**
 * Update donation by Paystack reference
 */
export async function updateDonationByReference(
  paystack_reference: string,
  status: 'pending' | 'completed' | 'failed'
) {
  const db = await getDB();
  return db`
    UPDATE donations 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE paystack_reference = ${paystack_reference}
    RETURNING *
  `;
}

/**
 * Get donation by ID
 */
export async function getDonationById(id: number) {
  const db = await getDB();
  return db`SELECT * FROM donations WHERE id = ${id}`;
}

/**
 * Get donation by Paystack reference
 */
export async function getDonationByReference(paystack_reference: string) {
  const db = await getDB();
  return db`SELECT * FROM donations WHERE paystack_reference = ${paystack_reference}`;
}

/**
 * Delete donation
 */
export async function deleteDonation(id: number) {
  const db = await getDB();
  return db`DELETE FROM donations WHERE id = ${id} RETURNING *`;
}

/**
 * Update donation
 */
export async function updateDonation(
  id: number,
  updates: {
    donor_name?: string;
    donor_email?: string;
    amount?: number;
    message?: string | null;
    payment_type?: 'online' | 'cash';
    status?: 'pending' | 'completed' | 'failed';
  }
) {
  const db = await getDB();
  const { donor_name, donor_email, amount, message, payment_type, status } = updates;

  return db`
    UPDATE donations 
    SET 
      donor_name = COALESCE(${donor_name || null}, donor_name),
      donor_email = COALESCE(${donor_email || null}, donor_email),
      amount = COALESCE(${amount || null}, amount),
      message = COALESCE(${message !== undefined ? message : null}, message),
      payment_type = COALESCE(${payment_type || null}, payment_type),
      status = COALESCE(${status || null}, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  const db = await getDB();

  const result = await db`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'completed') as total_donations,
      COUNT(DISTINCT donor_email) FILTER (WHERE status = 'completed') as total_donors,
      COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_amount,
      COUNT(*) FILTER (WHERE status = 'completed' AND payment_type = 'online') as online_donations,
      COUNT(*) FILTER (WHERE status = 'completed' AND payment_type = 'cash') as cash_donations
    FROM donations
  `;

  return {
    totalDonations: parseInt(result[0].total_donations),
    totalDonors: parseInt(result[0].total_donors),
    totalAmount: parseFloat(result[0].total_amount),
    onlineDonations: parseInt(result[0].online_donations),
    cashDonations: parseInt(result[0].cash_donations),
  };
}

/**
 * Get admin user by username
 */
export async function getAdminByUsername(username: string) {
  const db = await getDB();
  return db`SELECT * FROM admin_users WHERE username = ${username}`;
}

/**
 * Create admin user
 */
export async function createAdmin(username: string, password_hash: string) {
  const db = await getDB();
  return db`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${password_hash})
    RETURNING id, username
  `;
}
