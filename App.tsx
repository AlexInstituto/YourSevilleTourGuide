import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import BottomTabs from './src/navigation/BottomTabs';
import { getCurrentSession, onAuthStateChange } from './src/services/auth';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession ?? null);
      } catch (err) {
        console.error('Error obteniendo sesión:', err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    init();

    const subscription = onAuthStateChange((newSession: Session | null) => {
      setSession(newSession);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      {session ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
