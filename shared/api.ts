/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse {
  message: string;
}

export interface InitDonationRequest {
  fullName: string;
  email: string;
  amount: number;
  message?: string | null;
}

export interface InitDonationResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface WebhookVerificationRequest {
  reference: string;
}

export interface WebhookVerificationResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
      customer_code: string;
      first_name: string;
      last_name: string;
    };
    metadata?: {
      message?: string;
    };
  };
}

export interface Donor {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  message: string | null;
  payment_type: "online" | "cash";
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface PublicDonor {
  id: string;
  donor_name: string;
  message: string | null;
  payment_type: string;
  created_at: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

export interface ManualDonationRequest {
  donor_name: string;
  donor_email: string;
  amount: number;
  message?: string | null;
}

export interface DashboardStats {
  totalDonations: number;
  totalDonors: number;
  totalAmount: number;
  onlineDonations: number;
  cashDonations: number;
}
