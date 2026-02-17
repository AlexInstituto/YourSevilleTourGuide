import { supabase } from './supabase';
import { uploadImage } from './image';

export type Tour = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  created_at?: string;
}

export type Stop = {
  id: string;
  tour_id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export type Profile = {
  id: string;
  username?: string;
  avatar_url?: string;
}

export async function getTours(): Promise<Tour[]> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Tour[];
}

export async function getTour(id: string): Promise<Tour> {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Tour;
}

export async function updateTour(
  id: string,
  updates: Partial<Omit<Tour, 'id' | 'user_id' | 'created_at'>>
): Promise<Tour> {
  const { data, error } = await supabase
    .from('tours')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Tour;
}


export async function createTour(name: string, description?: string, image_url?: string): Promise<Tour[]> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('tours')
    .insert([{ name, description, image_url, user_id: user.id }]);
  if (error) throw error;
  if (!data) return [];
  return data as Tour[];
}

export async function deleteTour(id: string): Promise<void> {
  const { error } = await supabase.from('tours').delete().eq('id', id);
  if (error) throw error;
}

export async function getStops(tourId: string): Promise<Stop[]> {
  const { data, error } = await supabase
    .from('stops')
    .select('*')
    .eq('tour_id', tourId);
  if (error) throw error;
  return data as Stop[];
}

export async function updateStop(
  id: string,
  updates: Partial<Omit<Stop, 'id' | 'tour_id'>>
): Promise<Stop> {
  const { data, error } = await supabase
    .from('stops')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Stop;
}


export async function createStop(
  title: string,
  description: string,
  latitude: number,
  longitude: number,
  tour_id: string,
  image_url?: string
): Promise<Stop[]> {
  const { data, error } = await supabase
    .from('stops')
    .insert([{ title, description, latitude, longitude, tour_id, image_url }]);
  if (error) throw error;
  if(!data) return [];
  return data as Stop[];
}

export async function deleteStop(id: string): Promise<void> {
  const { error } = await supabase.from('stops').delete().eq('id', id);
  if (error) throw error;
}

export async function getProfile(): Promise<Profile> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData?.user;
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(username: string, localUri?: string): Promise<Profile[]> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error('Usuario no autenticado');

  let avatarUrl: string | undefined;
  if (localUri) {
    avatarUrl = await uploadImage(localUri, userId);
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ username, avatar_url: avatarUrl })
    .eq('id', userId);
  if (error) throw error;
  if (!data) return [];
  return data as Profile[];
}
