import { User, CreateUserData } from '../types/Auth';
import supabaseService from '../config/supabase';
import { CustomError } from '../middleware/errorHandler';

export class UserModel {
  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to find user by ID');
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to find user by email');
    }
  }

  /**
   * Create new user
   */
  static async create(userData: CreateUserData): Promise<User> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('users')
        .insert({
          email: userData.email.toLowerCase(),
          password_hash: userData.password_hash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new CustomError('Email already exists', 409);
        }
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to create user');
    }
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(id: string): Promise<void> {
    try {
      const { error } = await supabaseService
        .getClient()
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to update last login');
    }
  }

  /**
   * Update user information
   */
  static async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabaseService
        .getClient()
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to update user');
    }
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabaseService
        .getClient()
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to delete user');
    }
  }

  /**
   * Get user count
   */
  static async getCount(): Promise<number> {
    try {
      const { count, error } = await supabaseService
        .getClient()
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw new CustomError(`Database error: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      throw error instanceof CustomError ? error : new CustomError('Failed to get user count');
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      return false;
    }
  }
}

export default UserModel;