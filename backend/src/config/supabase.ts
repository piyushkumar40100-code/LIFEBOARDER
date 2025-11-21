import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    // Debug logging
    console.log('🔍 Supabase config - DATABASE_URL:', config.database.url?.substring(0, 50) + '...');

    if (!config.database.url) {
      throw new Error('DATABASE_URL is not configured in environment variables');
    }

    this.client = createClient(config.database.url, '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client.from('users').select('id').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }

  // Raw SQL execution helper
  async sql(query: string, params?: any[]): Promise<any> {
    try {
      const { data, error } = await this.client.rpc('exec_sql', {
        query,
        params,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('SQL execution failed:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;