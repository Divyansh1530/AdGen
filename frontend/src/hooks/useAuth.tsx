  import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
  import type { User, RegisterInput, LoginInput, AuthResponse } from "../types/user";
  import {
    registerUser as apiRegisterUser,
    loginUser as apiLoginUser,
    getCurrentUser as apiGetCurrentUser,
    logoutUser as apiLogoutUser,
  } from "../api/auth";

  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (input: RegisterInput) => Promise<AuthResponse>;
    login: (input: LoginInput) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  const USER_STORAGE_KEY = "adgen_user_profile";

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
      if (typeof window === "undefined") return null;
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Sync user state with localStorage
    const updateUser = useCallback((newUser: User | null) => {
      setUser(newUser);
      if (typeof window !== "undefined") {
        if (newUser) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    }, []);

    const refreshUser = useCallback(async () => {
      try {
        const res = await apiGetCurrentUser();
        if (res?.success && res.data) {
          updateUser(res.data);
        } else {
          updateUser(null);
        }
      } catch {
        // Not authenticated or cookies expired
        updateUser(null);
      } finally {
        setIsLoading(false);
      }
    }, [updateUser]);

    useEffect(() => {
      refreshUser();
    }, [refreshUser]);

    const register = async (input: RegisterInput): Promise<AuthResponse> => {
      const res = await apiRegisterUser(input);
      if (res?.data?.user) {
        updateUser(res.data.user);
      }
      return res;
    };

    const login = async (input: LoginInput): Promise<AuthResponse> => {
      const res = await apiLoginUser(input);
      if (res?.data?.user) {
        updateUser(res.data.user);
      }
      return res;
    };

    const logout = async (): Promise<void> => {
      try {
        await apiLogoutUser();
      } finally {
        updateUser(null);
      }
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          isLoading,
          register,
          login,
          logout,
          refreshUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }

  export default useAuth;
