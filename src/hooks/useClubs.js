import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function useClubs({ page_size = 3, myClubsOnly = false }) {
  let { user } = useContext(AppContext);
  let [clubs, setClubs] = useState([]);
  let [page, setPage] = useState(0);
  let [clubCnt, setClubCnt] = useState(0);
  let [showModal, setShowModal] = useState(false);

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
    const { count } = myClubsOnly ?
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

  async function handleCreateClub(ev) {
    ev.preventDefault();
    if (ev.target.name.value) {
      const { data, error } = await supabase
        .from("clubs")
        .insert({name: ev.target.name.value} )
        .select();

        setClubs([data, ...clubs]);
        setShowModal(false);
    }
  }

  async function handleDeleteClub(club_id) {
      const { data, error } = await supabase
        .from("clubs")
        .delete()
        .eq("club_id", club_id);
    setClubs(clubs.filter((c) => c.club_id != club_id),);
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
    handleDeleteClub,
    handleJoinClub,
    clubs,
    page,
    setPage,
    page_size,
    clubCnt,
    showModal,
    setShowModal
  };
}
