# iCare Vision Foundation - Donation Platform

A modern, full-stack donation platform for managing Christmas fundraising for orphans.

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon)
- **Payment Gateway**: Paystack
- **Authentication**: JWT

## Features

### Public Features
- Beautiful landing page with mission statement
- Online donation form with Paystack integration
- Public donor list (names only, no amounts shown)
- Responsive design for mobile and desktop

### Admin Features
- JWT-based authentication
- Dashboard with donation statistics
- Donor management (CRUD operations)
- Manual donation entry for cash donations
- Filter donations by type and date

## Setup Instructions

### 1. Database Setup (Neon PostgreSQL)

1. Create a new Neon PostgreSQL database
2. Copy the connection string (DATABASE_URL)
3. Execute the SQL schema in `server/db/schema.sql`:
   ```bash
   psql postgresql://your-connection-string < server/db/schema.sql
   ```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `PAYSTACK_PUBLIC_KEY`: Get from Paystack dashboard
- `PAYSTACK_SECRET_KEY`: Get from Paystack dashboard
- `JWT_SECRET`: Generate a secure random string

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Development

```bash
pnpm dev
```

The app will start at http://localhost:5173

### 5. Build for Production

```bash
pnpm build
```

## API Endpoints

### Public Routes
- `POST /api/donate/init` - Initialize Paystack payment
- `POST /api/donate/verify` - Verify payment
- `GET /api/donors` - Get public donor list (no amounts)
- `POST /api/paystack/webhook` - Paystack webhook handler

### Admin Routes (Require JWT Token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/donors` - Get all donors with amounts
- `POST /api/admin/donors/manual-add` - Add manual donation
- `PUT /api/admin/donors/:id` - Update donation
- `DELETE /api/admin/donors/:id` - Delete donation
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Demo Credentials

For testing purposes:
- **Username**: admin
- **Password**: password

⚠️ Change these credentials immediately in production!

## Pages

### Public Pages
- `/` - Home/Landing page
- `/donate` - Donation form
- `/donors` - Public donor list
- `/admin/login` - Admin login

### Admin Pages
- `/admin/dashboard` - Dashboard with statistics
- `/admin/donors` - Donor management

## Payment Integration (Paystack)

### Webhook Setup
1. Go to Paystack dashboard
2. Set webhook URL to: `https://yoursite.com/api/paystack/webhook`
3. Subscribe to the `charge.success` event

### Testing
- Use Paystack test keys for development
- Use test card: 4111111111111111

## Database Schema

### donations table
```sql
- id: Primary key
- donor_name: Donor's full name
- donor_email: Donor's email
- amount: Donation amount in USD
- message: Optional donor message
- payment_type: 'online' or 'cash'
- status: 'pending', 'completed', or 'failed'
- paystack_reference: Paystack transaction reference
- created_at: Timestamp
- updated_at: Timestamp
```

### admin_users table
```sql
- id: Primary key
- username: Admin username
- password_hash: Bcrypt hashed password
- created_at: Timestamp
- updated_at: Timestamp
```

## Security Considerations

1. **Password Hashing**: Use bcrypt for admin password hashing
2. **JWT**: Tokens expire after 24 hours
3. **Input Validation**: All inputs are validated with Zod
4. **CORS**: Configured to accept only authorized origins
5. **Environment Variables**: Never commit secrets to git

## Deployment

### Netlify Deployment
1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

### Environment Variables for Production
```
DATABASE_URL=postgresql://...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
JWT_SECRET=generate-secure-random-string
NODE_ENV=production
```

## Troubleshooting

### Payment not processing
- Verify Paystack keys are correct
- Check webhook is configured
- Verify database connection

### Admin login fails
- Check DATABASE_URL is correct
- Verify admin_users table has data
- Check password hash is correct

### Donation not appearing in list
- Check donation status is 'completed'
- Verify Paystack webhook was received
- Check database for pending donations

## Support

For issues or questions, contact: info@icarevision.org
