import { useContext } from "react";
import {AppContext} from "./App"
import {supabase} from "./supabaseClient";

export default function UserHome() {

    let {user } = useContext(AppContext);
    return (
      <div>
        {user?.email}
    </div>
    )
}