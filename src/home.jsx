import { useContext } from "react";
import {AppContext} from "./App"
import {supabase} from "./supabaseClient";

export default function UserHome() {
    async function signOut() {
        supabase.auth.signOut();
      }

    let {user } = useContext(AppContext);
    return (
      <div>
        {user?.email}
      <button onClick = {signOut} className = "btn btn-error">
        Sign Out
      </button>
    </div>
    )
}