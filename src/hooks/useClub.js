import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function useClub({ club_id }) {
  let { user } = useContext(AppContext);
  let [club, setClub] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (club_id) {
      handleLoadClub();
    }
  }, []);

  let role = club?.club_memberships.find((mem) => mem.user_id == user.id)?.role;

  async function handleLoadClub() {
    const { data } = await supabase
      .from("clubs")
      .select(
        "*, club_memberships(role, user_id, profiles(full_name, grad_year))"
      )
      .single()
      .eq("club_id", club_id)

    setClub(data);
  }

  async function handleLeaveClub() {
    await supabase
      .from("club_memberships")
      .delete()
      .eq("user_id", user.id)
      .eq("club_id", club_id)
    
    navigate("/")
  }

  return { club, role, handleLeaveClub }
}