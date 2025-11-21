import dotenv from 'dotenv';

console.log('Loading environment variables...');
dotenv.config();

console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);
console.log('All environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('JWT')));

try {
  const { z } = require('zod');

  const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  });

  const env = envSchema.parse(process.env);
  console.log('✅ DATABASE_URL parsed successfully:', env.DATABASE_URL.substring(0, 20) + '...');
} catch (error) {
  console.error('❌ Error parsing environment:', error);
}