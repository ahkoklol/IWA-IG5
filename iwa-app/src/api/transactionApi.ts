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

/**
 * Create a purchase transaction.
 */
export async function purchaseTransaction(
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const response = await httpClient.post<Transaction>(
    `/transaction/purchase`,
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
    `/transaction/${clientId}`,
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
    `/stripe/register`,
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
    `/stripe/onboarding-link`,
    body,
  );

  return response.data;
}
