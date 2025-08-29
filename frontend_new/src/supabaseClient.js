// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kmwlfrhtxyvgyucccqil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttd2xmcmh0eHl2Z3l1Y2NjcWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTUzMDgsImV4cCI6MjA3MDY5MTMwOH0.GGm4xN3FaKGZW74wEoHiYXqfzCGJrspbGKvT7AcPSqw';

// --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
// Убираем все лишние опции. 
// Клиент Supabase v2 умный и сам знает, как лучше работать с сессиями.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);