import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    // Extract Supabase URL from PostgreSQL connection string
    const postgresUrl = config.database.url;

    // Convert postgresql://postgres:password@db.xyz.supabase.co:5432/postgres
    // To: https://xyz.supabase.co
    const supabaseUrl = postgresUrl.replace(/postgresql:\/\/[^@]*@db\.(.+)\.supabase\.co:5432\/.*/, 'https://$1.supabase.co');

    console.log('🔍 Supabase config - Original URL:', postgresUrl.substring(0, 50) + '...');
    console.log('🔍 Supabase config - Supabase URL:', supabaseUrl);

    if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
      throw new Error('Invalid DATABASE_URL format. Expected Supabase connection string');
    }

    // Use the Supabase anon key for authentication
    this.client = createClient(supabaseUrl, config.database.supabaseAnonKey, {
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