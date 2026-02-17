import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htnafhtvntjojwogxabi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NpdqvL4Y1mjKyf_d4rwipQ_1U4-Za2z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
