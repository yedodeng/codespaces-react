import { useContext } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../App";

export default function QueryTest() {
  let { user } = useContext(AppContext);
  async function test() {
    let item = await supabase
      .from("clubs")
      .select("*, club_memberships(*)")
      .eq("club_memberships.user_id", user.id);

    console.clear();
    console.table(item.data.filter((c) => c.club_memberships.length === 1));
    console.table(item.data.filter((c) => c.club_memberships.length !== 1));
  }

  return (
    <div>
      <button className="btn" onClick={test}>
        test
      </button>
    </div>
  );
}
