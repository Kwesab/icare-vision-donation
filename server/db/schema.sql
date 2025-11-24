-- iCare Vision Foundation Database Schema
-- PostgreSQL (Neon)

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('online', 'cash')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  paystack_reference VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_payment_type ON donations(payment_type);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_paystack_reference ON donations(paystack_reference);
CREATE INDEX idx_admin_users_username ON admin_users(username);

-- Insert default admin user (username: admin, password: password)
-- Password hash should be replaced with bcrypt hash in production
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$8qCKRMFNAGBq4RHqzCXRheExE0TwTK.I3IVlImEb9ZeJMhF3nqD4i')
ON CONFLICT (username) DO NOTHING;
