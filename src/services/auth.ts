import { supabase } from './supabase';
import { RealtimeSubscription } from '@supabase/supabase-js';

export async function getCurrentSession(): Promise<any> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback: (session: any) => void): RealtimeSubscription {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return data.subscription;
}

export async function signIn(email: string, password: string): Promise<any> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
