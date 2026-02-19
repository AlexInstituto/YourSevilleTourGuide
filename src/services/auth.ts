import { supabase } from "./supabase";
import { AuthSession, Session, SupabaseClient } from "@supabase/supabase-js";

/**
 * Obtiene la sesión actual del usuario
 */
export async function getCurrentSession(): Promise<Session | null> {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data.session;
}

/**
 * Escucha cambios en la autenticación
 * Devuelve un objeto de suscripción que puedes usar para cancelar la escucha
 */
export function onAuthStateChange(callback: (session: Session | null) => void) {
	const { data: subscription } = supabase.auth.onAuthStateChange(
		(_event, session) => {
			callback(session);
		},
	);

	return subscription;
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(
	email: string,
	password: string,
): Promise<{ session: Session | null; user: any }> {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
}

/**
 * Cierra sesión
 */
export async function signOut(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
