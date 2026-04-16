import { supabase } from "../api/supabaseClient";

export const uploadComplaintImage = async (file, userId) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("complaint-media")
    .upload(filePath, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("complaint-media")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
};