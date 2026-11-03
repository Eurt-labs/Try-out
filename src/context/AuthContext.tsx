import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { UserProfile } from '../types';
import { DEMO_USER } from '../data/demoOutfits';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (email: string, password: string, name: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = useCallback(async (currentUserId: string, currentUserEmail?: string) => {
    if (!isConfigured) {
      setProfile(DEMO_USER);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching Supabase profile:', error.message);
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.name || currentUserEmail?.split('@')[0] || 'Member',
          email: data.email || currentUserEmail || '',
          avatarUrl: data.avatar_url,
          tier: data.tier || 'Standard Member',
          preferences: data.preferences || DEMO_USER.preferences,
          stats: DEMO_USER.stats
        });
      } else {
        // Fallback profile with user metadata
        setProfile({
          id: currentUserId,
          name: currentUserEmail?.split('@')[0] || 'Member',
          email: currentUserEmail || '',
          avatarUrl: undefined,
          tier: 'Standard Member',
          preferences: DEMO_USER.preferences,
          stats: DEMO_USER.stats
        });
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err);
      setProfile(DEMO_USER);
    }
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured) {
      // In demo mode when Supabase credentials are not provided
      setProfile(DEMO_USER);
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, fetchProfile]);

  const signInWithPassword = async (email: string, password: string) => {
    if (!isConfigured) {
      // Demo login
      setProfile({ ...DEMO_USER, email, name: email.split('@')[0] });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error: error as Error | null };
  };

  const signUpWithPassword = async (email: string, password: string, name: string) => {
    if (!isConfigured) {
      // Demo sign up
      setProfile({ ...DEMO_USER, email, name });
      return { error: null, user: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        }
      }
    });

    if (!error && data.user) {
      // Create profile row if needed
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      });
    }

    return { error: error as Error | null, user: data.user };
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    }

    if (!user) {
      return { success: false, error: 'User is not authenticated' };
    }

    try {
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.preferences !== undefined) payload.preferences = updates.preferences;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      return { success: false, error: msg };
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!isConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        updateProfile,
        getAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

