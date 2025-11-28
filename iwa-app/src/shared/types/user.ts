//iwa-app/src/shared/types/user.ts

export interface User {
  clientId: string;
  address: string;
  nationality: string;
  phone: string;
  photo: string;
  stripeId: string;
  dateModified: Date;
  dateOfBirth: Date;
  userId: string;
  photoId: string;
}
