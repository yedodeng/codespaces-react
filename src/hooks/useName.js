import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useName({club_id}) {
    let [name, setName] = useState();
  
    useEffect(() => {
      if (club_id) loadName();
    }, [club_id]);
  
    async function loadName() {
      let { data } = await supabase
        .from("clubs")
        .select("name")
        .eq("club_id", club_id)
        .single();
      setName(data.name);
    }
  
    async function handleUpdateName(newName) {
      await supabase
        .from("clubs")
        .update({ name: newName })
        .eq("club_id", club_id);
      setName(newName);
    }
  
    return {name, handleUpdateName};
  }