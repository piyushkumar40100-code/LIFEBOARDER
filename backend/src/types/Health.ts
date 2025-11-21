export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface CreateHealthMetricData {
  metric_type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface UpdateHealthMetricData {
  metric_type?: string;
  value?: number;
  unit?: string;
  date?: string;
  notes?: string;
}