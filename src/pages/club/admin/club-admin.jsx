import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import ManageDesc from "./manage-desc";
import ManageName from "./manage-title";
import ManageMembers from "./manage-members";
import ManageAnns from "./manage-anns";
import ManageEvents from "./manage-events";

export default function ClubAdmin() {
  let { club_id } = useParams();

  return (
    <div>
      <ManageName club_id={club_id} />
      <div className = "my-4"></div>
      <ManageDesc club_id={club_id} />
      <div className = "my-4"></div>
      <ManageMembers club_id={club_id} />
      <div className = "my-4"></div>
      <ManageAnns club_id={club_id}></ManageAnns>
      <div className = "my-4"></div>
      {/* <ManageEvents club_id={club_id}></ManageEvents> */}
    </div>
  );
}





function ManageMember({ club_id }) {
  const { members, setMembers } = useMembers({ club_id });

  return <div className="p-4 bg-slate-600">{JSON.stringify(members)}</div>;
}

function useMembers({ club_id }) {
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
