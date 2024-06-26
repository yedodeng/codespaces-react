import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function useClubs({ page_size = 3, myClubsOnly = false }) {
  let { user } = useContext(AppContext);
  let [clubs, setClubs] = useState([]);
  let [page, setPage] = useState(0);
  let [clubCnt, setClubCnt] = useState(0);

  useEffect(() => {
    loadClubs();
  }, [page]);

  useEffect(() => {
    loadClubCnt();
  }, []);

  async function loadClubs() {
    const {data} = myClubsOnly
      ? await supabase
          .from("clubs")
          .select("*, club_memberships!inner(*)")
          .eq("club_memberships.user_id", user.id)
          .range(page * page_size, page * page_size + page_size - 1)
      : await supabase
          .from("clubs")
          .select("*, club_memberships(*)")
          .eq("club_memberships.user_id", user.id)
          .range(page * page_size, page * page_size + page_size - 1);

    setClubs([...clubs, ...data]);
  }

  async function loadClubCnt() {
    const { count  } = myClubsOnly ?
     await supabase
    .from("clubs")
    .select("*, club_memberships!inner(*)", { count: "exact", head: true })
    .eq("club_memberships.user_id", user.id) 
    : await supabase
    .from("clubs")
    .select("*, club_memberships(*)", { count: "exact", head: true })
    .eq("club_memberships.user_id", user.id)
    setClubCnt(count);
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
    page_size,
    clubCnt
  };
}
