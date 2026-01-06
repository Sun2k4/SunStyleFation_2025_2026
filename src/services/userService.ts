import { User } from "../types";
import { supabase } from "./supabaseClient";

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
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
    // Note: Deleting from 'profiles' usually cascades to auth.users if set up in DB,
    // or requires a backend function to delete the auth user.
    // Here we delete the profile record.
    const { error } = await supabase.rpc("delete_user_by_admin", {
      target_user_id: id,
    });

    if (error) throw error;
  },
};
