//iwa-app/src/shared/types/transaction.ts

export interface Transaction {
  transactionId: string;
  date: string;
  status: TransactionStatus;
  commission: number;
  stripeCommission: number;
  paymentMethodId: string;
  stripePaymentIntentId: string;
  clientId: string;
  postId: string;
  total: number;
}

export type TransactionStatus =
  | "initiated"
  | "requires_action"
  | "failed"
  | "completed"
  | string;

export interface CreateTransactionPayload {
  postId: string;
  clientId: string;
  paymentMethodId: string;
}

export interface StripeRegisterPayload {
  clientId: string;
  email: string;
}

export interface StripeOnboardingLinkPayload {
  stripeId: string;
}

export interface StripeRegisterResponse {
  stripeAccountId: string;
}

export interface StripeOnboardingLinkResponse {
  accountLinkUrl: string;
}
