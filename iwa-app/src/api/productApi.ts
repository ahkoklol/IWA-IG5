// iwa-app/src/api/productApi.ts
import type {
  Product,
  Category,
  CreateProductPayload,
  UpdateProductPayload,
} from "../shared/types/product";

import { httpClient } from "./httpClient";

/**
 * Get all products.
 */
export async function getAllProducts(): Promise<Product[]> {
  const response = await httpClient.get<Product[]>("/post");
  return response.data;
}

/**
 * Get a product by ID.
 */
export async function getProductById(postId: string): Promise<Product> {
  const response = await httpClient.get<Product>(`/post/${postId}`);
  return response.data;
}

/**
 * Create a new product.
 */
export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response = await httpClient.post<Product>("/post", payload);
  return response.data;
}

/**
 * Update a product by ID.
 */
export async function updateProduct(
  postId: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await httpClient.patch<Product>(
    `/post/${postId}`,
    payload,
  );
  return response.data;
}

/**
 * Delete a product.
 */
export async function deleteProduct(postId: string): Promise<void> {
  await httpClient.delete(`/post/${postId}`);
}

/**
 * Hide a product.
 */
export async function hideProduct(postId: string): Promise<void> {
  await httpClient.patch(`/post/${postId}/hide`);
}

/**
 * Unhide a product.
 */
export async function unhideProduct(postId: string): Promise<void> {
  await httpClient.patch(`/post/${postId}/unhide`);
}

/**
 * Ban a product.
 */
export async function banProduct(postId: string): Promise<void> {
  await httpClient.patch(`/post/${postId}/ban`);
}

/**
 * Unban a product.
 */
export async function unbanProduct(postId: string): Promise<void> {
  await httpClient.patch(`/post/${postId}/unban`);
}

/**
 * Add product to favourites.
 */
export async function favouriteProduct(
  postId: string,
  clientId: string,
): Promise<void> {
  await httpClient.post(`/post/${postId}/favourite`, clientId);
}

/**
 * Remove product from favourites.
 */
export async function unfavouriteProduct(
  postId: string,
  clientId: string,
): Promise<void> {
  await httpClient.delete(`/post/${postId}/favourite`, {
    data: clientId, // Axios requires body in DELETE to be put in `data`
  });
}

/**
 * Get products currently selling by a client.
 */
export async function getSellingProducts(clientId: string): Promise<Product[]> {
  const response = await httpClient.get<Product[]>(
    `/post/${clientId}/sellList`,
  );
  return response.data;
}

/**
 * Get sold products by a client.
 */
export async function getSoldProducts(clientId: string): Promise<Product[]> {
  const response = await httpClient.get<Product[]>(
    `/post/${clientId}/soldList`,
  );
  return response.data;
}

/**
 * Buy a product.
 */
export async function buyProduct(
  postId: string,
  buyerId: string,
): Promise<Product> {
  const url = `/post/${postId}/buy?buyerId=${encodeURIComponent(buyerId)}`;

  const response = await httpClient.patch<Product>(url);
  return response.data;
}

/**
 * Get all categories.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await httpClient.get<Category[]>(`/post/category`);
  return response.data;
}

/**
 * Get products by category.
 */
export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const response = await httpClient.get<Product[]>(
    `/post/category/${encodeURIComponent(category)}`,
  );
  return response.data;
}
