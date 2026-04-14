import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

export function useRealtimeComplaints(userId) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setComplaints(data || []);
    };

    fetch();

    const channel = supabase
      .channel("complaints-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetch();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return { complaints };
}