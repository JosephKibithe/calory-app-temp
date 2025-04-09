import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProfile } from '../lib/models';
import { userProfileApi } from '../lib/api';
import { useAuth } from './AuthContext';

type UserContextType = {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  refreshProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const profile = await userProfileApi.getProfile();
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await userProfileApi.upsertProfile(data);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Failed to update user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        loading,
        error,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
