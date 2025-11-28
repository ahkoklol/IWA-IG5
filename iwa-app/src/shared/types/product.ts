//iwa-app/src/shared/types/product.ts

export interface Product {
  postId: string;
  dateCreated: Date;
  dateModified: Date;
  description: string;
  photos: string[];
  weight: number;
  quantity: number;
  type: string;
  season: string;
  edible: boolean;
  floweringSeason: string;
  harvestDate: string;
  price: number;
  status: string;
  clientId: string;
}
