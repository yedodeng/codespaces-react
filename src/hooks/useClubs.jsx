import { useContext, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function useClubs() {
  let { user } = useContext(AppContext);
  let [items, setItems] = useState([]);

  // useEffect(() => {
  //   console.log("useClubs loading...");
  //   read();
  // }, []);

  async function loadClubs({ page = 1, page_size = 2, myClubOnly = false }) {
    let item = myClubOnly
      ? await supabase
          .from("clubs")
          .select("*, club_memberships!inner(*)")
          .eq("club_memberships.user_id", user.id)
      : await supabase.from("clubs").select("*");

    console.log(item.data);
    setItems(item.data);
  }

  async function handleCreateClub() {
    const name = prompt("Enter club name:");
    if (name) {
      const { data, error } = await supabase
        .from("clubs")
        .insert({ name })
        .select();
      if (error) alert(error.message);
      else console.log(data);
    }
    loadClubs();
  }

  async function handleUpdateClub(club_id) {
    let name = prompt("Enter a name for this club");
    if (name) {
      const { data, error } = await supabase
        .from("clubs")
        .update({ name })
        .eq("club_id", club_id);
    }
    loadClubs();
  }

  async function handleDeleteClub(club_id) {
    if (confirm("Confirm Deletetion>") || true) {
      const { data, error } = await supabase
        .from("clubs")
        .delete()
        .eq("club_id", club_id);
    }
    loadClubs();
  }

  async function handleJoinClub(club_id) {
    if (confirm("Confirm Joining?") || true) {
      const { data, error } = await supabase
        .from("club_memberships")
        .insert({
          user_id: user.id,
          club_id,
        })
        .select();
    }
    loadClubs();
  }

  return {
    items,
    handleCreateClub,
    handleUpdateClub,
    handleDeleteClub,
    handleJoinClub,
    loadClubs,
  };
}
