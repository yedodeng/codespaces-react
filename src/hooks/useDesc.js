import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useDesc({ club_id }) {
    let [desc, setDesc] = useState();
  
    useEffect(() => {
      if (club_id) loadDesc();
    }, [club_id]);
  
    async function loadDesc() {
      let { data } = await supabase
        .from("clubs")
        .select("description")
        .eq("club_id", club_id)
        .single();
      setDesc(data.description);
    }
  
    async function handleUpdateDesc(newDesc) {
      await supabase
        .from("clubs")
        .update({ description: newDesc })
        .eq("club_id", club_id);
      setDesc(newDesc);
    }
  
    return { desc, handleUpdateDesc };
  }