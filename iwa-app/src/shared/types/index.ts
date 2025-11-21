export interface User {
  id: number;
  username: string;
  fullName: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  nationality: string;
  followers: number;
  following: number;
  bio: string;
}

export interface Review {
  id: number;
  reviewer: User;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: string;
  price: string; 
  images: string[];
  description: string;
  category: string;
  plantingPeriod: string;
  floweringPeriod: string;
  edible: boolean;
  harvestDate: string;
  seller: User;
  isFavorite?: boolean;
  removedByAI?: boolean;
}


export type Category =
  | "Légumes"
  | "Fruits"
  | "Herbes aromatiques / épices"
  | "Plantes médicinales"
  | "Fleurs décoratives"
  | "Plantes exotiques / rares";

export type SortBy = "Pertinence" | "Prix croissant" | "Prix décroissant" | "Le plus récent";
export type EdibleFilter = "Oui" | "Non" | "Peu importe";

export interface Filters {
  sortBy: SortBy | null;
  category: Category | null;
  plantingPeriod: string[];
  floweringPeriod: string[];
  edible: EdibleFilter | null;
}

export type NotificationType = "favorite" | "sale" | "review" | "removed";

export interface Notification {
  id: number;
  type: NotificationType;
  user: User;
  product: Product;
  date: string;
  read: boolean;
}

export type TransactionStatus = "in_progress" | "completed";

export interface Transaction {
  id: number;
  product: Product;
  date: string;
  price: string;
  status: TransactionStatus;
  reviewed: boolean;
}

export interface Report {
  id: number;
  productName: string;
  productId: number;
  reportCount: number;
  date: string; // ISO string ou date lisible
  description: string;
  status: "pending" | "approved" | "rejected";
}

