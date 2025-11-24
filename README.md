# iCare Vision Foundation - Christmas Fundraising Platform

A full-stack donation platform built for iCare Vision Foundation to support Christmas fundraising for orphans.

## 🎯 Features

### Public Features
- **Donation System** - Online donations via Paystack (USD)
- **Public Donor Wall** - Display donor names and messages (amounts hidden)
- **Responsive Design** - Modern UI with TailwindCSS

### Admin Features
- **Secure Login** - JWT-based authentication
- **Dashboard** - Real-time stats (total donations, amounts, donors)
- **Donor Management** - View, add, edit, and delete donations
- **Manual Entry** - Add cash donations received offline
- **Filtering** - Sort by date and payment type

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: Neon (PostgreSQL)
- **Payment**: Paystack
- **Auth**: JWT + bcrypt

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Update the `.env` file with your credentials:

```env
# Database URL from Neon
DATABASE_URL=postgresql://user:password@host/database

# Paystack Keys (get from your Paystack dashboard)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# JWT Secret (change this!)
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
```

### 3. Set Up Database

The database schema is in `server/db/schema.sql`. Run it on your Neon database:

```sql
-- Creates donations and admin_users tables
-- See server/db/schema.sql for full schema
```

### 4. Create Admin User

Run the initialization script to create your first admin user:

```bash
pnpm tsx server/scripts/init-admin.ts
```

**Default credentials:**
- Username: `admin`
- Password: `password`

⚠️ **IMPORTANT**: Change this password after first login!

### 5. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:8080`

### 6. Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
client/
├── pages/
│   ├── Index.tsx              # Home page
│   ├── Donate.tsx             # Donation form
│   ├── Donors.tsx             # Public donor list
│   ├── AdminLogin.tsx         # Admin login
│   ├── AdminDashboard.tsx     # Admin dashboard
│   └── AdminDonors.tsx        # Donor management
└── components/ui/             # Pre-built UI components

server/
├── index.ts                   # Express server setup
├── db.ts                      # Database functions
├── routes/
│   ├── donations.ts           # Public donation routes
│   └── admin.ts               # Admin routes
├── db/
│   └── schema.sql             # Database schema
└── scripts/
    └── init-admin.ts          # Admin user creation

shared/
└── api.ts                     # Shared TypeScript types
```

## 🔐 API Endpoints

### Public Routes

- `POST /api/donate/init` - Initialize Paystack payment
- `POST /api/donate/verify` - Verify payment after Paystack redirect
- `POST /api/paystack/webhook` - Paystack webhook for real-time updates
- `GET /api/donors` - Get public donor list (no amounts)

### Admin Routes (JWT Required)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/donors` - Get all donations (with amounts)
- `POST /api/admin/donors/manual-add` - Add cash donation
- `PUT /api/admin/donors/:id` - Update donation
- `DELETE /api/admin/donors/:id` - Delete donation

## 💳 Paystack Integration

### Testing
Use Paystack test cards for development:
- Card: `4084084084084081`
- Expiry: Any future date
- CVV: `408`

### Production
The project is configured with live Paystack keys. Ensure your Paystack account is fully set up for live transactions.

### Webhook Setup
Configure Paystack webhook URL in your dashboard:
- URL: `https://yourdomain.com/api/paystack/webhook`
- Events: `charge.success`

## 🚀 Deployment

### Option 1: Netlify (Recommended)
```bash
pnpm build
# Deploy dist/ folder to Netlify
```

### Option 2: Vercel
```bash
pnpm build
# Deploy via Vercel CLI or dashboard
```

### Option 3: Traditional Server
```bash
pnpm build
pnpm start
# Runs on port 8080 by default
```

## 📊 Database Schema

### `donations` Table
- `id` - Primary key
- `donor_name` - Full name of donor
- `donor_email` - Email address
- `amount` - Donation amount in USD
- `message` - Optional message
- `payment_type` - 'online' or 'cash'
- `status` - 'pending', 'completed', or 'failed'
- `paystack_reference` - Paystack transaction reference
- `created_at` - Timestamp
- `updated_at` - Timestamp

### `admin_users` Table
- `id` - Primary key
- `username` - Admin username
- `password_hash` - Bcrypt hashed password
- `created_at` - Timestamp

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 24-hour expiration
- Paystack webhook signature verification
- Input validation and sanitization
- Protected admin routes with JWT middleware
- SQL injection prevention via parameterized queries

## 🎨 Customization

### Colors
Edit `client/global.css` and `tailwind.config.ts` to customize the theme colors.

### Email Notifications
Add email service integration in `server/routes/donations.ts` after successful donations.

### Receipt Generation
Implement PDF receipt generation in the donation verification endpoint.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct in `.env`
- Check Neon database is accessible
- Ensure database schema is applied

### Paystack Payment Fails
- Check PAYSTACK_SECRET_KEY is correct
- Verify Paystack account is activated for USD
- Check currency is set to USD in transaction initialization

### Admin Login Fails
- Run `pnpm tsx server/scripts/init-admin.ts` to recreate admin user
- Verify JWT_SECRET is set in `.env`

## 📝 License

This project is built for iCare Vision Foundation.

## 🙏 Support

For issues or questions, contact the development team.
