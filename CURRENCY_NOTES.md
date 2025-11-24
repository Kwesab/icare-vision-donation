# Currency Configuration Notes

## Paystack Ghana - USD Support

Your platform is configured for **Paystack Ghana** which natively supports USD transactions.

### Current Configuration

- **Currency**: USD ($)
- **Payment Processor**: Paystack Ghana
- **Supported Payment Methods**: Card, Mobile Money (MTN, Vodafone, AirtelTigo)

### Getting Paystack Ghana Keys

⚠️ **IMPORTANT**: You need Paystack Ghana keys (not Nigerian keys) to process USD.

1. **Sign up at Paystack Ghana**: https://paystack.com/gh
2. **Create a Ghana-based business account**
3. **Get your API keys** from Settings → API Keys & Webhooks
4. **Update your `.env` file** with Ghana keys:

```env
PAYSTACK_SECRET_KEY=sk_live_your_ghana_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_ghana_public_key
```

### Supported Currencies (Paystack Ghana)

- USD (US Dollar) ✅
- GHS (Ghanaian Cedi) ✅
- Multiple other currencies

### Testing

**Test Cards for Paystack Ghana:**
- **Card Number**: 4084 0840 8408 4081
- **Expiry**: Any future date
- **CVV**: 408
- **OTP**: 123456

### Live Payments

Once you switch to Paystack Ghana keys:
1. Donors can pay in USD with international cards
2. Mobile money options will be available for Ghanaian donors
3. All amounts stored and displayed in USD

### Current Issue

If you're still getting "Currency not supported" error, it means you're using **Nigerian Paystack keys**. 

**Solution**: Get Paystack Ghana keys from https://paystack.com/gh
