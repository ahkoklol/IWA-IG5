// iwa-app/src/api/userApi.ts
import type {
  User,
  UserReview,
  CreateUserPayload,
  UpdateUserPayload,
  CreateUserReviewPayload,
} from "../shared/types/user";

import { httpClient } from "./httpClient";
import { FormData as PolyfillFormData } from "formdata-polyfill";
import {AuthContext} from "../context/authContext";

// Définit global.FormData si absent (doit être fait avant les autres imports qui utilisent FormData)
if (typeof globalThis.FormData === "undefined") {
  // @ts-ignore
  globalThis.FormData = PolyfillFormData;
}



/**
 * Get a user by client ID.
 */
export async function getUser(clientId: string): Promise<User> {
  const response = await httpClient.get<User>(`/user/${clientId}`);
  return response.data;
}

/**
 * Register a new user.
 */
export async function registerUser(
  payload: CreateUserPayload,
  token?: string,
): Promise<User> {

  const path = `/user/register`;
  const base = (httpClient as any)?.defaults?.baseURL ?? "";
  const fullUrl = base + path;

  console.log("base URL:", base);
    console.log("full URL:", fullUrl);

  try {

    console.log("POST", fullUrl);
    console.log("payload:", payload);


    const response = await httpClient.post<User>(path, payload ,
    {
      headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  )

    return response.data;
  } catch (error: any) {
    console.log("Error during user registration:", error.response ?? error);
    throw error;
  }
}

/**
 * Update an existing user.
 */
export async function updateUser(
  clientId: string,
  payload: UpdateUserPayload,
): Promise<void> {
  await httpClient.put(`/user/${clientId}`, payload);
}

/**
 * Delete a user.
 */
export async function deleteUser(clientId: string): Promise<void> {
  await httpClient.delete(`/user/${clientId}`);
}

/**
 * Get reviews received by a user.
 */
export async function getUserReviews(
  clientId: string,
): Promise<UserReview[]> {
  const response = await httpClient.get<UserReview[]>(
    `/user/${clientId}/reviews`,
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
    `/user/${clientId}/review`,
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
    `/user/${clientId}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

/**
 * Get a user by Keycloak user ID (gateway route: /user/{userId}/user).
 * Returns backend user info including clientId and userId.
 */
export async function getUserByKeycloakUserId(
  userId: string,
  token?: string,
): Promise<User> {
  console.log("azer", userId, token);
  try {
    const response = await httpClient.get<User>(`/user/${userId}/user`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
    )
    console.log("response", response);
    return response.data;
  }
    catch (error: any) {
        console.log("Error fetching user by Keycloak ID:", error.response ?? error);
    }


}
