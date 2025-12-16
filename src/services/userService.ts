import { User } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

// Mock data for fallback
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sunny Admin",
    email: "admin@sunstyle.com",
    role: "admin",
    avatarUrl: "https://ui-avatars.com/api/?name=Sunny+Admin&background=random",
  },
  {
    id: "2",
    name: "Alex Shopper",
    email: "alex@email.com",
    role: "user",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Alex+Shopper&background=random",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    avatarUrl: "https://ui-avatars.com/api/?name=Jane+Doe&background=random",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john@example.com",
    role: "user",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Smith&background=random",
  },
];

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    if (!isSupabaseConfigured()) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_USERS), 600)
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data.map((profile: any) => ({
      id: profile.id,
      name: profile.full_name || "Unknown",
      email: profile.email || "", // Assumes email is synced to profiles table
      role: profile.role || "user",
      avatarUrl: profile.avatar_url,
    }));
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<void> => {
    if (!isSupabaseConfigured()) {
      // Mock update
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...updates };
      }
      return;
    }

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.role) dbUpdates.role = updates.role;

    const { error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", id);

    if (error) throw error;
  },

  deleteUser: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      const index = MOCK_USERS.findIndex((u) => u.id === id);
      if (index !== -1) MOCK_USERS.splice(index, 1);
      return;
    }

    // Note: Deleting from 'profiles' usually cascades to auth.users if set up in DB,
    // or requires a backend function to delete the auth user.
    // Here we delete the profile record.
    const { error } = await supabase.rpc("delete_user_by_admin", {
      target_user_id: id,
    });

    if (error) throw error;
  },
};
