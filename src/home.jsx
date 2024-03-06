import { useContext, useEffect, useState } from "react";
import {AppContext} from "./App"
import {supabase} from "./supabaseClient";

export default function UserHome() {

  useEffect(() => {
    read()
  }, []);

  let [items, setItems] = useState([]);

  async function read() {
    let item = await supabase.from("clubs").select("*");
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

    let {user } = useContext(AppContext);
    return (
      <div>
        <div>
        {items.map((v) => (
          <div className="flex flex-col border-2 p-2 border-secondary w-1/3 mb-4" key = {v.id}>
          <div className = "text-xl mb-2">{v.name}</div>
          <div className="text-sm text-gray-500">Created at {v.created_at}</div>
        </div>
        ))}</div>
        {user.roles.is_admin && (<button className ="mt-4 btn btn-primary" onClick={handleCreateClub}>Create Club</button>)}
    </div>
    )
}