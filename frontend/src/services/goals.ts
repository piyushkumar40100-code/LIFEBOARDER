import apiClient from './api';
import { Goal, CreateGoalData, UpdateGoalData } from '../types/Goal';

export const goalsService = {
  async getGoals(): Promise<Goal[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Goal[] }>('/api/v1/goals');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch goals');
    }
  },

  async createGoal(goalData: CreateGoalData): Promise<Goal> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Goal }>('/api/v1/goals', goalData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create goal');
    }
  },

  async updateGoal(id: string, updates: UpdateGoalData): Promise<Goal> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Goal }>(`/goals/${id}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update goal');
    }
  },

  async deleteGoal(id: string): Promise<void> {
    try {
      await apiClient.delete(`/goals/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete goal');
    }
  },
};

export default goalsService;