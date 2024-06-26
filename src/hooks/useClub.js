import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function useClub({club_id}) {
    let { user } = useContext(AppContext);
    let [club, setClub] = useState(undefined);
    
    useEffect(() => {
      if (club_id) {
        handleLoadClub();
      }
    }, []);
  
    let role = club?.club_memberships.find((mem) => mem.user_id == user.id)?.role;
  
    async function handleLoadClub() {
      const { data, error } = await supabase
        .from("clubs")
        .select(
          "*, club_memberships(role, user_id, profiles(full_name, grad_year))"
        )
        .single()
        .eq("club_id", club_id)
  
      setClub(data);
    }

    return {club, role}
}