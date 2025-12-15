import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../services/supabaseClient";
import { User, UserRole } from "../types";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to map Supabase session user to our App's User type
  const mapSessionToUser = (sessionUser: any): User => {
    // Check metadata for role, default to 'user'
    const role = (sessionUser.user_metadata?.role as UserRole) || "user";

    return {
      id: sessionUser.id,
      name:
        sessionUser.user_metadata?.full_name ||
        sessionUser.email?.split("@")[0] ||
        "User",
      email: sessionUser.email || "",
      role: role,
      avatarUrl:
        sessionUser.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${sessionUser.email}&background=random`,
    };
  };

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(mapSessionToUser(session.user));
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        if (mounted) setIsLoading(false);
      }
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSessionToUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
