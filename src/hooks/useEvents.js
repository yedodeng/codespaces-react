import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../App";

export default function useEvents({ club_id, page_size }) {
  let [events, setEvents] = useState([]);
  let [evCnt, setEvCnt] = useState(0);
  let [page, setPage] = useState(0);
  let [showModal, setShowModal] = useState(false);
  let { user } = useContext(AppContext);

  useEffect(() => {
    if (club_id) {
      handleLoadEvents();
    }
  }, [page]);

  useEffect(() => {
    if (club_id) handleLoadEvCnt();
  }, [club_id]);

  async function handleLoadEvCnt() {
    const { count } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("club_id", club_id);
    setEvCnt(count);
  }

  async function handleLoadEvents() {
    const { data } = await supabase
      .from("events")
      .select("*, event_reservations(*)")
      .eq("club_id", club_id)
      .order("created_at", { ascending: false })
      .range(page * page_size, page * page_size + page_size - 1);
    setEvents([...events, ...data]);
  }

  async function handleAddEvent(ev) {
    ev.preventDefault();
    let date = new Date(`${ev.target.date.value} ${ev.target.time.value}`);
    let obj = {
      club_id: club_id,
      text: ev.target.text.value,
      author: user.full_name,
      title: ev.target.title.value,
      date,
    };
    const { data } = await supabase
      .from("events")
      .insert(obj)
      .select()
      .single();

    setEvents([data, ...events]);
    setShowModal(false);
  }

  async function handleEditEvent(ev, ev_id) {
    ev.preventDefault();
    let date = new Date(`${ev.target.date.value} ${ev.target.time.value}`);
    await supabase
      .from("events")
      .update({
        text: ev.target.text.value,
        title: ev.target.title.value,
        date,
      })
      .eq("ev_id", ev_id);

    setEvents(events.map((a) =>
      a.ev_id == ev_id
        ? {
          ...a,
          text: ev.target.text.value,
          title: ev.target.title.value,
          date,
        }
        : a
    ),
    );
  }

  async function handleDeleteEvent(ev_id) {
    await supabase
      .from("events")
      .delete()
      .eq("ev_id", ev_id);

    setEvents(events.filter((a) => a.ev_id != ev_id));
  }

  async function handleReserveEvent(ev_id, reserved) {
    if (!reserved) {
      const { data } = await supabase
        .from("event_reservations")
        .insert({
          user_id: user.id,
          ev_id,
        })
        .select()
        .single();

      setEvents(events.map((ev) =>
        ev.ev_id == ev_id
          ? { ...ev, event_reservations: [...ev.event_reservations, data] }
          : ev
      ));
    } else {
      await supabase
        .from("event_reservations")
        .delete()
        .eq("user_id", user.id);

      setEvents(events.map((ev) =>
        ev.ev_id == ev_id
          ? {
            ...ev,
            event_reservations: ev.event_reservations.filter(
              (e) => e.user_id != user.id
            ),
          }
          : ev
      ));
    }
  }
  
  return {
    events, evCnt, page, setPage,
    handleEditEvent, handleDeleteEvent, handleAddEvent,
    handleReserveEvent, setShowModal, showModal,
  }
}
