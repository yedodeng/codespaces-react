import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App"
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

export default function UserHome() {

  let { user } = useContext(AppContext);
  let [reveal, setReveal] = useState(false);

  useEffect(() => {
    read()
  }, []);

  let [items, setItems] = useState([]);

  async function read() {
    let item = await supabase.from("clubs").select("*, club_memberships(*)")
    .eq("club_memberships.user_id", user.id);
    console.log(item.data);
    setItems(item.data);
  }

  async function handleCreateClub() {
    const name = prompt("Enter club name:");
    if (name) {
      const { data, error } = await supabase.from("clubs").insert({ name }).select();
      if (error) alert(error.message);
      else console.log(data);
    }
    read();
  }

  async function handleUpdateClub(club_id) {
    let name = prompt("Enter a name for this club");
    if (name) {
      const {data, error} = await supabase 
      .from("clubs")
      .update({name})
      .eq("club_id", club_id)
    }
    read();
  }

  async function handleDeleteClub(club_id) {
    if (confirm("Confirm Deletetion>") || true) {
      const {data, error} = await supabase 
      .from("clubs")
      .delete()
      .eq("club_id", club_id)
    }
    read();
  }

  async function handleJoinClub(club_id) {
    if (confirm("Confirm Joining?") || true) {
      const {data, error} = await supabase 
      .from("club_memberships")
      .insert({
        user_id: user.id,
        club_id
      }).select()
    }
    read();
  }
  
  return (
    <div>
      <div className = "mb-2">Welcome <strong>{user.full_name}!</strong></div>
      <div>
        {items.filter((v) => v.club_memberships?.length > 0 || user.roles.is_admin).map((v) => (
          <div className="flex flex-col border-2 p-2 border-secondary w-1/3 mb-4" key={v.club_id}>
            <Link to={`/club/${v.club_id}`} className="text-xl mb-2">{v.name}</Link>
            {/* <div className="text-sm text-gray-500">Created at {v.created_at}</div> */}
            
            <div className = "flex">
              <button disabled={v.club_memberships?.length > 0} className="btn btn-xs btn-success mr-4" onClick={() => handleJoinClub(v.club_id)}>Join</button>
              {user.roles.is_admin && (
                <div>
            <button className="btn btn-xs btn-warning mr-4" onClick={() => handleUpdateClub(v.club_id)}>Edit</button>
            <button className = "btn btn-xs bg-red-400" onClick={()=> handleDeleteClub(v.club_id)}> Delete</button>
            </div>
              )}
            </div>
            
        </div>
        ))}

          {reveal && 
          <div>
            <div className = "divider divider-primary"></div>
          {items.filter((v) => v.club_memberships.length == 0).map((v) => (
          <div className="flex flex-col border-2 p-2 border-secondary w-1/3 mb-4" key={v.id}>
            <div className="text-xl mb-2">{v.name}</div>
            {/* <div className="text-sm text-gray-500">Created at {v.created_at}</div> */}
            
            <div className = "flex">
              <button disabled={v.club_memberships?.length > 0} className="btn btn-xs btn-success mr-4" onClick={() => handleJoinClub(v.club_id)}>Join</button>
              {user.roles.is_admin && (
                <div>
            <button className="btn btn-xs btn-warning mr-4" onClick={() => handleUpdateClub(v.club_id)}>Edit</button>
            <button className = "btn btn-xs bg-red-400" onClick={()=> handleDeleteClub(v.club_id)}> Delete</button>
            </div>
              )}
            </div>       
        </div>
        ))}
        </div>
        }
      </div>
      {!user.roles.is_admin && <button className = "btn" onClick={() => setReveal(!reveal)}>{!reveal ? "Join New Club" : "Cancel"}</button>}
      {user.roles.is_admin && (<button className="btn btn-primary" onClick={handleCreateClub}>Create Club</button>)}
    </div>
  )
}
