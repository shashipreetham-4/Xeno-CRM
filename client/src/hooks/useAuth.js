import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSession();

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
};
