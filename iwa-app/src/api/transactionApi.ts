// iwa-app/src/api/transactionApi.ts
import type {
  Transaction,
  CreateTransactionPayload,
  StripeRegisterPayload,
  StripeOnboardingLinkPayload,
  StripeRegisterResponse,
  StripeOnboardingLinkResponse,
} from "../shared/types/transaction";

import { httpClient } from "./httpClient";

const TRANSACTION_BASE_URL = "http://localhost:8080/transaction";
const STRIPE_BASE_URL = "http://localhost:8080/stripe";

/**
 * Create a purchase transaction.
 */
export async function purchaseTransaction(
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const response = await httpClient.post<Transaction>(
    `${TRANSACTION_BASE_URL}/purchase`,
    payload,
  );

  return response.data;
}

/**
 * Get transactions for a client by ID.
 */
export async function getTransactionsByClientId(
  clientId: string,
): Promise<Transaction[]> {
  const response = await httpClient.get<Transaction[]>(
    `${TRANSACTION_BASE_URL}/${clientId}`,
  );

  return response.data;
}

/**
 * Register a Stripe account for payouts.
 */
export async function registerStripeAccount(
  payload: StripeRegisterPayload,
): Promise<StripeRegisterResponse> {
  const body = {
    clientId: payload.clientId,
    email: payload.email,
  };

  const response = await httpClient.post<StripeRegisterResponse>(
    `${STRIPE_BASE_URL}/register`,
    body,
  );

  return response.data;
}

/**
 * Request an onboarding link for Stripe Express dashboard setup.
 */
export async function getStripeOnboardingLink(
  payload: StripeOnboardingLinkPayload,
): Promise<StripeOnboardingLinkResponse> {
  const body = {
    stripeId: payload.stripeId,
  };

  const response = await httpClient.post<StripeOnboardingLinkResponse>(
    `${STRIPE_BASE_URL}/onboarding-link`,
    body,
  );

  return response.data;
}
