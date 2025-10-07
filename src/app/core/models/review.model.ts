export interface Review {
  id?: number;
  productId: number;
  userName?: string; // optional, if backend provides it
  rating: number; // 1..5
  comment: string;
  createdAt?: string; // ISO datetime
}
