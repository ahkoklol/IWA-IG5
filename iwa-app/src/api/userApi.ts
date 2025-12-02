// iwa-app/src/api/userApi.ts
import type {
  User,
  UserReview,
  CreateUserPayload,
  UpdateUserPayload,
  CreateUserReviewPayload,
} from "../shared/types/user";

import { httpClient } from "./httpClient";

const USER_BASE_URL = "http://localhost:8080/user";

/**
 * Get a user by client ID.
 */
export async function getUser(clientId: string): Promise<User> {
  const response = await httpClient.get<User>(`${USER_BASE_URL}/${clientId}`);
  return response.data;
}

/**
 * Register a new user.
 */
export async function registerUser(
  payload: CreateUserPayload,
): Promise<User> {
  const response = await httpClient.post<User>(
    `${USER_BASE_URL}/register`,
    payload,
  );
  return response.data;
}

/**
 * Update an existing user.
 */
export async function updateUser(
  clientId: string,
  payload: UpdateUserPayload,
): Promise<void> {
  await httpClient.put(`${USER_BASE_URL}/${clientId}`, payload);
}

/**
 * Delete a user.
 */
export async function deleteUser(clientId: string): Promise<void> {
  await httpClient.delete(`${USER_BASE_URL}/${clientId}`);
}

/**
 * Get reviews received by a user.
 */
export async function getUserReviews(
  clientId: string,
): Promise<UserReview[]> {
  const response = await httpClient.get<UserReview[]>(
    `${USER_BASE_URL}/${clientId}/reviews`,
  );
  return response.data;
}

/**
 * Create a review for a user.
 */
export async function createUserReview(
  clientId: string,
  payload: CreateUserReviewPayload,
): Promise<UserReview> {
  const response = await httpClient.post<UserReview>(
    `${USER_BASE_URL}/${clientId}/review`,
    payload,
  );
  return response.data;
}

/**
 * Upload a user profile photo.
 */
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

  await httpClient.post(
    `${USER_BASE_URL}/${clientId}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}
