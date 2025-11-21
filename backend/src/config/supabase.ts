import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
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