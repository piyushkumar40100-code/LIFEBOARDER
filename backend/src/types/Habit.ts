export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitData {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count?: number;
}

export interface UpdateHabitData {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  target_count?: number;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}