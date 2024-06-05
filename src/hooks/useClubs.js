import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function useClubs({ pageSize = 2, myClubsOnly = false }) {
  let { user } = useContext(AppContext);
  let [allClubs, setAllClubs] = useState([]);
  let [page, setPage] = useState(1);

  useEffect(() => {
    loadAllClubs();
  }, []);

  let clubs = allClubs.slice((page - 1) * pageSize, page * pageSize);
  let numPages = Math.ceil((allClubs.length + 1) / pageSize);

  async function loadAllClubs() {
    let item = myClubsOnly
      ? await supabase
          .from("clubs")
          .select("*, club_memberships!inner(*)")
          .eq("club_memberships.user_id", user.id)
      : await supabase
          .from("clubs")
          .select("*, club_memberships(*)")
          .eq("club_memberships.user_id", user.id);

    console.log("num clubs", item.data.length);
    setAllClubs(item.data);

    // setMyClubs(item.data.filter((c) => c.club_memberships.length === 1));
    // setAllClubs(item.data.filter((c) => c.club_memberships.length !== 1));
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
    handleCreateClub,
    handleUpdateClub,
    handleDeleteClub,
    handleJoinClub,
    clubs,
    page,
    setPage,
    numPages,
  };
}
