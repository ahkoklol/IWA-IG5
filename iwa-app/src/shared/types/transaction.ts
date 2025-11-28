//iwa-app/src/shared/types/transaction.ts

export interface Transaction {
  transactionId: string;
  date: Date;
  status: string;
  commission: number;
  stripeCommission: number;
  paymentMethodId: string;
  stripePaymentIntentId: string;
  clientId: string;
  postId: string;
  total: number;
}
