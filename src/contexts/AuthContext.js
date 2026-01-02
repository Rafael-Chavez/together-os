import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase, HOUSEHOLD_ID } from '../config/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with email/password
  async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Sync user to Supabase if doesn't exist
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', userCredential.user.uid)
      .single();

    if (!existingUser) {
      await supabase.from('users').insert({
        firebase_uid: userCredential.user.uid,
        email: userCredential.user.email,
        display_name: userCredential.user.displayName || email.split('@')[0],
        household_id: HOUSEHOLD_ID,
      });
    }

    return userCredential;
  }

  // Sign out
  async function signOut() {
    await firebaseSignOut(auth);
    setUserProfile(null);
  }

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user profile from Supabase
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', user.uid)
          .single();

        setUserProfile(data);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
