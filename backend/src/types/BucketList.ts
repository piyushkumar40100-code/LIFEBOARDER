export interface BucketItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  completed: boolean;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBucketItemData {
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
}

export interface UpdateBucketItemData {
  title?: string;
  description?: string;
  category?: string;
  target_date?: string;
  completed?: boolean;
  completed_date?: string;
}