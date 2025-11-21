export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  target_date?: string;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  target_date?: string;
  status?: 'active' | 'completed' | 'paused';
}