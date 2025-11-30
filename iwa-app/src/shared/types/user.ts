//iwa-app/src/shared/types/user.ts

export interface User {
  clientId: string;
  address: string;
  nationality: string;
  phone: string;
  photo: string | null;
  stripeId: string | null;
  dateModified: string;
  dateOfBirth: string | null;
  userId: string;
  photoId: string | null;
}

export interface UserReview {
  buyerId: string;
  postId: string;
  rating: number;
  comment: string;
  dateCreated: string;
  dateModified: string;
  sellerId: string;
}

export interface CreateUserPayload {
  address: string;
  nationality: string;
  phone: string;
  userId: string;
  dateOfBirth?: string;
  photo?: string;
  stripeId?: string;
  photoId?: string;
}

export type UpdateUserPayload = Partial<
  Omit<User, "clientId" | "userId" | "dateModified">
>;

export interface CreateUserReviewPayload {
  buyerId: string;
  postId: string;
  rating: number;
  comment: string;
}
