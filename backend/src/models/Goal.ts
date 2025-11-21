import { Goal, CreateGoalData, UpdateGoalData } from '../types/Goal';
import supabaseService from '../config/supabase';
import { CustomError } from '../middleware/errorHandler';

export class GoalModel {
  /**
   * Find all goals for a specific user
   */
  static async findByUserId(userId: string): Promise<Goal[]> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to fetch goals');
    }
  }

  /**
   * Find goal by ID (user-specific)
   */
  static async findById(id: string, userId: string): Promise<Goal | null> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to find goal');
    }
  }

  /**
   * Create new goal for a user
   */
  static async create(goalData: CreateGoalData, userId: string): Promise<Goal> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('goals')
        .insert({
          user_id: userId,
          title: goalData.title,
          description: goalData.description || null,
          target_date: goalData.target_date || null,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to create goal');
    }
  }

  /**
   * Update existing goal (user-specific)
   */
  static async update(id: string, updates: UpdateGoalData, userId: string): Promise<Goal> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new CustomError('Goal not found', 404);
        }
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to update goal');
    }
  }

  /**
   * Delete goal (user-specific)
   */
  static async delete(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabaseService
        .getClient()
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to delete goal');
    }
  }

  /**
   * Get goals count for a user
   */
  static async getCount(userId: string, status?: Goal['status']): Promise<number> {
    try {
      let query = supabaseService
        .getClient()
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { count, error } = await query;

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to get goals count');
    }
  }

  /**
   * Get goals by status for a user
   */
  static async findByStatus(userId: string, status: Goal['status']): Promise<Goal[]> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to fetch goals by status');
    }
  }

  /**
   * Check if goal exists for user
   */
  static async exists(id: string, userId: string): Promise<boolean> {
    try {
      const goal = await this.findById(id, userId);
      return goal !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get goal statistics for a user
   */
  static async getStats(userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    paused: number;
  }> {
    try {
      const [total, active, completed, paused] = await Promise.all([
        this.getCount(userId),
        this.getCount(userId, 'active'),
        this.getCount(userId, 'completed'),
        this.getCount(userId, 'paused'),
      ]);

      return {
        total,
        active,
        completed,
        paused,
      };
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to get goal statistics');
    }
  }
}

export default GoalModel;