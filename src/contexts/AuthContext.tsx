import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { showToast } from "../components/Toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    const initAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession?.user) {
          try {
            await upsertUser(initialSession.user);
            setSession(initialSession);
            setUser(initialSession.user);
          } catch (error) {
            console.error("Failed to upsert initial user:", error);
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(null);
          setUser(null);
        }

        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              try {
                await upsertUser(session.user);
                setSession(session);
                setUser(session.user);
              } catch (error) {
                console.error("Failed to upsert user on sign in:", error);
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
              }
            } else if (event === "SIGNED_OUT") {
              setSession(null);
              setUser(null);
            } else if (session?.user) {
              setSession(session);
              setUser(session.user);
            }
          },
        );

        subscription = data?.subscription;
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const upsertUser = async (user: User) => {
    try {
      console.log("Attempting to upsert user:", user.id, user.email);

      const currentProvider = user.app_metadata?.provider || "email";
      const { data: existingUser }: { data: any } = await supabase
        .from("users")
        .select("provider")
        .eq("email", user.email!)
        .single();

      if (existingUser && existingUser.provider !== currentProvider) {
        console.warn(
          `Provider mismatch: ${user.email} already registered with ${existingUser.provider}`,
        );
        showToast(
          `This email is already registered with ${existingUser.provider}. Please sign in with ${existingUser.provider} instead.`,
          "warning",
          5000,
        );
        await supabase.auth.signOut();
        throw new Error(
          `Provider mismatch: please use ${existingUser.provider}`,
        );
      }

      const { data, error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: currentProvider,
      } as any);

      if (error) {
        console.error("Upsert error:", error);
        throw error;
      }

      console.log("User upserted successfully:", data);

      const { data: verifyData, error: verifyError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (verifyError || !verifyData) {
        console.error("User verification failed after upsert:", verifyError);
        throw new Error("User was not created in database");
      }

      console.log("User verified in database");
    } catch (error) {
      console.error("Fatal error in upsertUser:", error);
      throw error;
    }
  };

  const checkProviderMismatch = async (
    email: string,
    newProvider: "google" | "github",
  ) => {
    try {
      const { data, error }: { data: any; error: any } = await supabase
        .from("users")
        .select("provider")
        .eq("email", email)
        .single();

      if (!error && data) {
        const currentProvider = data.provider;
        if (currentProvider !== newProvider) {
          showToast(
            `This email is already registered with ${currentProvider}. Please sign in with ${currentProvider} instead.`,
            "warning",
            5000,
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      return true;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
