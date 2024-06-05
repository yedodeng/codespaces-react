import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { json, useParams, useSearchParams } from "react-router-dom";

export default function ClubAdmin() {
  let { club_id } = useParams();

  return (
    <div>
      <MemberManage club_id={club_id} />
    </div>
  );
}

function MemberManage({ club_id }) {
  const { members, setMembers } = useClubAdmin({ club_id });

  return <div className="p-4 bg-slate-600">{JSON.stringify(members)}</div>;
}

function useClubAdmin({ club_id }) {
  let [members, setMembers] = useState([]);

  useEffect(() => {
    if (club_id) loadMembers();
  }, [club_id]);

  async function loadMembers() {
    let { data } = await supabase
      .from("club_memberships")
      .select("*")
      .eq("club_id", club_id)
      .limit(10);
    setMembers(data);
  }

  return { members, setMembers };
}
