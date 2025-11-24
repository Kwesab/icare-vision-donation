# 🚀 Quick Setup Checklist

Follow these steps to get your iCare Vision Foundation donation platform running:

## ✅ Pre-Launch Checklist

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env` (already done)
- [ ] Update `DATABASE_URL` with your Neon PostgreSQL connection string
- [ ] Verify Paystack keys are correct (live keys already configured)
- [ ] Change `JWT_SECRET` to a secure random string

### 2. Database Setup
- [ ] Create a database on [Neon](https://neon.tech)
- [ ] Run the SQL schema from `server/db/schema.sql` in your Neon SQL editor
- [ ] Verify tables `donations` and `admin_users` were created

### 3. Create Admin User
```bash
pnpm init-admin
```
- [ ] Run the command above to create your first admin
- [ ] Note down the credentials (username: admin, password: password)
- [ ] Plan to change password after first login

### 4. Test Locally
```bash
pnpm dev
```
- [ ] Visit http://localhost:8080
- [ ] Test public donation form (use Paystack test card: 4084084084084081)
- [ ] Test admin login at http://localhost:8080/admin/login
- [ ] Verify dashboard shows stats correctly
- [ ] Test adding manual cash donation
- [ ] Verify donor list appears publicly

### 5. Paystack Configuration
- [ ] Login to [Paystack Dashboard](https://dashboard.paystack.com)
- [ ] Go to Settings > API Keys & Webhooks
- [ ] Add webhook URL: `https://yourdomain.com/api/paystack/webhook`
- [ ] Select event: `charge.success`
- [ ] Save webhook configuration

### 6. Production Deployment
- [ ] Build project: `pnpm build`
- [ ] Test production build locally: `pnpm start`
- [ ] Deploy to your hosting provider (Netlify/Vercel/Traditional Server)
- [ ] Update Paystack webhook URL with production domain
- [ ] Test live donation with real card

### 7. Post-Launch
- [ ] Login to admin panel with default credentials
- [ ] Change admin password immediately
- [ ] Test full donation flow end-to-end
- [ ] Monitor donations in admin dashboard
- [ ] Share donation page with your community

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- Change the default admin password (`password`) immediately after first login
- Keep your `.env` file secure and never commit it to git
- Regularly backup your Neon database
- Monitor Paystack dashboard for transaction status

## 📞 Need Help?

If you encounter issues:
1. Check the README.md for detailed documentation
2. Verify all environment variables are set correctly
3. Check browser console and server logs for errors
4. Ensure database connection is working

## 🎉 You're Ready!

Once all items are checked, your donation platform is ready to help orphans this Christmas! 🎄
