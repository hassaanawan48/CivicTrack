import { supabase } from "../api/supabaseClient";

export const createComplaint = async (payload) => {
  const { data, error } = await supabase
    .from("complaints")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserComplaints = async (userId) => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// New: fetch all complaints for discover feed
export const getAllComplaints = async () => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};