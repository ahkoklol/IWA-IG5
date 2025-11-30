import type {
  Transaction,
  CreateTransactionPayload,
  StripeRegisterPayload,
  StripeOnboardingLinkPayload,
  StripeRegisterResponse,
  StripeOnboardingLinkResponse,
} from "../shared/types/transaction";

const TRANSACTION_BASE_URL = "http://localhost:8080/transaction";
const STRIPE_BASE_URL = "http://localhost:8080/stripe";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed with status ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}

async function handleVoidResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed with status ${response.status}: ${text}`);
  }
}

export async function purchaseTransaction(
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const response = await fetch(`${TRANSACTION_BASE_URL}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<Transaction>(response);
}

export async function getTransactionsByClientId(
  clientId: string,
): Promise<Transaction[]> {
  const response = await fetch(`${TRANSACTION_BASE_URL}/${clientId}`);
  return handleJsonResponse<Transaction[]>(response);
}

export async function registerStripeAccount(
  payload: StripeRegisterPayload,
): Promise<StripeRegisterResponse> {
  const body = {
    clientId: payload.clientId,
    email: payload.email,
  };

  const response = await fetch(`${STRIPE_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleJsonResponse<StripeRegisterResponse>(response);
}

export async function getStripeOnboardingLink(
  payload: StripeOnboardingLinkPayload,
): Promise<StripeOnboardingLinkResponse> {
  const body = {
    stripeId: payload.stripeId,
  };

  const response = await fetch(`${STRIPE_BASE_URL}/onboarding-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleJsonResponse<StripeOnboardingLinkResponse>(response);
}
