import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../App";
import { getMonth, isSameDay, setMonth, startOfMonth } from "date-fns";

export default function useCalendar({ isClub, club_id }) {
  let { user } = useContext(AppContext);
  let [events, setEvents] = useState([]);
  let [anns, setAnns] = useState([]);
  let [name, setName] = useState("Full");
  let [now, setNow] = useState(new Date());
  let first = startOfMonth(now);

  useEffect(() => {
    if (isClub) handleLoad();
    else handleLoad2();
  }, []);

  async function handleLoad() {
    let { data } = await supabase
      .from("events")
      .select("*")
      .eq("club_id", club_id);

    let { data: data2 } = await supabase
      .from("announcements")
      .select("*")
      .eq("club_id", club_id);

    let { data: data3 } = await supabase
      .from("clubs")
      .select("name")
      .eq("club_id", club_id)
      .single();

    setEvents(data);
    setAnns(data2);
    setName(data3.name);
  }

  async function handleLoad2() {
    console.clear();
    let { data: ids } = await supabase
      .from("club_memberships")
      .select("club_id")
      .eq("user_id", user.id)
    let ar = ids.map((id) => id.club_id);

    let { data } = await supabase
      .from("clubs")
      .select("name, events!inner(*)")
      .in("club_id", ar);

    let { data: data2 } = await supabase
      .from("clubs")
      .select("name, announcements!inner(*)")
      .in("club_id", ar);

    setEvents(data);
    setAnns(data2);
  }

  function next() {
    let future = new Date(now);
    future.setMonth(future.getMonth() + 1);
    setNow(future);
  }

  function prev() {
    let future = new Date(now);
    future.setMonth(future.getMonth() - 1);
    setNow(future);
  }

  function chk(i, d) {
    let d1 = new Date(now.getFullYear(), now.getMonth(), i);
    let d2 = new Date(d);
    return isSameDay(d1, d2);
  }

  return { events, anns, name, prev, next, chk, now, setNow, first }
}