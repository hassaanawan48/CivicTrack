import { supabase } from "../api/supabaseClient";

export const getAllComplaints = async () => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateComplaintStatus = async (id, status, user_id) => {
  const { data, error } = await supabase
    .from("complaints")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const resolveComplaint = async (id, payload) => {
  const { data, error } = await supabase
    .from("complaints")
    .update({
      status: "resolved",
      authority_response_text: payload.text,
      authority_image_url: payload.image_url,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};