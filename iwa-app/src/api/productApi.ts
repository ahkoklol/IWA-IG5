import type {
  Product,
  Category,
  CreateProductPayload,
  UpdateProductPayload,
} from "../shared/types/product";

// TODO: adapt this URL to your gateway / env
const LISTING_BASE_URL = "http://localhost:8080/post";

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

export async function getProductById(postId: string): Promise<Product> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}`);
  return handleJsonResponse<Product>(response);
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const response = await fetch(LISTING_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<Product>(response);
}

export async function updateProduct(
  postId: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<Product>(response);
}

export async function deleteProduct(postId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}`, {
    method: "DELETE",
  });
  return handleVoidResponse(response);
}

export async function hideProduct(postId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/hide`, {
    method: "PATCH",
  });
  return handleVoidResponse(response);
}

export async function unhideProduct(postId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/unhide`, {
    method: "PATCH",
  });
  return handleVoidResponse(response);
}

export async function banProduct(postId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/ban`, {
    method: "PATCH",
  });
  return handleVoidResponse(response);
}

export async function unbanProduct(postId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/unban`, {
    method: "PATCH",
  });
  return handleVoidResponse(response);
}

export async function favouriteProduct(postId: string, clientId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/favourite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientId),
  });
  return handleVoidResponse(response);
}

export async function unfavouriteProduct(postId: string, clientId: string): Promise<void> {
  const response = await fetch(`${LISTING_BASE_URL}/${postId}/favourite`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientId),
  });
  return handleVoidResponse(response);
}

export async function getSellingProducts(clientId: string): Promise<Product[]> {
  const response = await fetch(`${LISTING_BASE_URL}/${clientId}/sellList`);
  return handleJsonResponse<Product[]>(response);
}

export async function getSoldProducts(clientId: string): Promise<Product[]> {
  const response = await fetch(`${LISTING_BASE_URL}/${clientId}/soldList`);
  return handleJsonResponse<Product[]>(response);
}

export async function buyProduct(postId: string, buyerId: string): Promise<Product> {
  const url = `${LISTING_BASE_URL}/${postId}/buy?buyerId=${encodeURIComponent(buyerId)}`;
  const response = await fetch(url, { method: "PATCH" });
  return handleJsonResponse<Product>(response);
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${LISTING_BASE_URL}/category`);
  return handleJsonResponse<Category[]>(response);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`${LISTING_BASE_URL}/category/${encodeURIComponent(category)}`);
  return handleJsonResponse<Product[]>(response);
}
