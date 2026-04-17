import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrCreateRole = async () => {
      if (!user?.id) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.log("ROLE FETCH ERROR:", error);
      }

      // CASE 1: profile exists
      if (data?.role) {
        setRole(data.role);
        setLoading(false);
        return;
      }

      // CASE 2: profile missing → create it
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          role: "citizen",
        });

      if (insertError) {
        console.log("PROFILE INSERT ERROR:", insertError);
      }

      setRole("citizen");
      setLoading(false);
    };

    fetchOrCreateRole();
  }, [user?.id]);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);