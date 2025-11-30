import type {
  User,
  UserReview,
  CreateUserPayload,
  UpdateUserPayload,
  CreateUserReviewPayload,
} from "../shared/types/user";

const USER_BASE_URL = "http://localhost:8080/user";

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

export async function getUser(clientId: string): Promise<User> {
  const response = await fetch(`${USER_BASE_URL}/${clientId}`);
  return handleJsonResponse<User>(response);
}

export async function registerUser(payload: CreateUserPayload): Promise<User> {
  const response = await fetch(`${USER_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<User>(response);
}

export async function updateUser(
  clientId: string,
  payload: UpdateUserPayload,
): Promise<void> {
  const response = await fetch(`${USER_BASE_URL}/${clientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleVoidResponse(response);
}

export async function deleteUser(clientId: string): Promise<void> {
  const response = await fetch(`${USER_BASE_URL}/${clientId}`, {
    method: "DELETE",
  });
  return handleVoidResponse(response);
}

export async function getUserReviews(clientId: string): Promise<UserReview[]> {
  const response = await fetch(`${USER_BASE_URL}/${clientId}/reviews`);
  return handleJsonResponse<UserReview[]>(response);
}

export async function createUserReview(
  clientId: string,
  payload: CreateUserReviewPayload,
): Promise<UserReview> {
  const response = await fetch(`${USER_BASE_URL}/${clientId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<UserReview>(response);
}

export async function uploadUserPhoto(
  clientId: string,
  file: { uri: string; name: string; type: string },
): Promise<void> {
  const formData = new FormData();
  formData.append("photo", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const response = await fetch(`${USER_BASE_URL}/${clientId}/photo`, {
    method: "POST",
    body: formData,
  });

  return handleVoidResponse(response);
}
