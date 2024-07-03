import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../App";

export default function useAnns({ club_id, page_size }) {
    let [anns, setAnns] = useState([]);
    let [annCnt, setAnnCnt] = useState(0);
    let [page, setPage] = useState(0);
    let [showModal, setShowModal] = useState(false);
    let {user} = useContext(AppContext);

    useEffect(() => {
      if (club_id) handleLoadAnnouncements();
    }, [page]);
  
    useEffect(() => {
      if (club_id) handleLoadAnnouncementCnt();
    }, [club_id]);
  
    async function handleLoadAnnouncementCnt() {
      const { count, error } = await supabase
        .from("announcements")
        .select("*", { count: "exact", head: true })
        .eq("club_id", club_id);
  
      setAnnCnt(count);
    }
  
    async function handleLoadAnnouncements() {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * page_size, page * page_size + page_size - 1);
      
      setAnns([...anns, ...data]);
    }
  
    async function handleAddAnnouncement(ev) {
      ev.preventDefault();
      let obj = {
        club_id: club_id,
        text: ev.target.text.value,
        author: user.full_name,
      };
      const { data, error } = await supabase
        .from("announcements")
        .insert(obj)
        .select();
  
      setAnns([data, ...anns]);
      setShowModal(false);
    }
  
    async function handleEditAnnouncement(ev, close, ann_id) {
      ev.preventDefault();
  
      const { error } = await supabase
        .from("announcements")
        .update({ text: ev.target.text.value })
        .eq("ann_id", ann_id);
  
      setAnns(
        anns.map((a) =>
          a.ann_id == ann_id ? { ...a, text: ev.target.text.value } : a
        ),
      );
    }
  
    async function handleDeleteAnnouncement(ann_id) {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("ann_id", ann_id);
  
      setAnns(anns.filter((a) => a.ann_id != ann_id),);
    }
  
    return { anns, handleLoadAnnouncementCnt, annCnt, showModal,
      handleLoadAnnouncements, handleAddAnnouncement, setShowModal,
      handleEditAnnouncement, handleDeleteAnnouncement, page, setPage};
  }