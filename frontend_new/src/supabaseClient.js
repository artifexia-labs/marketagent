import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kmwlfrhtxyvgyucccqil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttd2xmcmh0eHl2Z3l1Y2NjcWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTUzMDgsImV4cCI6MjA3MDY5MTMwOH0.GGm4xN3FaKGZW74wEoHiYXqfzCGJrspbGKvT7AcPSqw';

// ИЗМЕНЕНИЕ: Мы явно указываем заголовки, чтобы гарантировать авторизацию
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    // Эта опция помогает с управлением сессиями, на всякий случай
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // ЭТО САМЫЙ ВАЖНЫЙ БЛОК ДЛЯ РЕШЕНИЯ ПРОБЛЕМЫ 401
  global: {
    headers: {
      'apikey': supabaseAnonKey
      // Authorization заголовок клиент добавит сам, главное - apikey
    }
  }
});