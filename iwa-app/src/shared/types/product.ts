//iwa-app/src/shared/types/product.ts

export interface Product {
  postId: string;
  dateCreated: string;
  dateModified: string;
  title: string;                // NEW
  description: string;
  photos: string[];
  weight: number;
  quantity: number;
  category: string;
  season: string;
  edible: boolean;
  floweringSeason: string;
  harvestDate: string;
  price: number;
  status: string;
  clientId: string;
}

export interface Category {
  categoryId: string;
  name: string;
}

export type ProductStatus = "visible" | "hidden" | "banned" | "sold" | string;

export interface CreateProductPayload {
  title: string;                // NEW
  description: string;
  photos: string[];
  weight: number;
  quantity: number;
  category: string;
  season: string;
  edible: boolean;
  floweringSeason: string;
  harvestDate: string;
  price: number;
  clientId: string;
}

export type UpdateProductPayload = Partial<
  Omit<
    Product,
    | "postId"
    | "clientId"
    | "status"
    | "dateCreated"
    | "dateModified"
  >
>;
