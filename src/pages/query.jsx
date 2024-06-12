import { useContext } from "react";
import { supabase } from "../supabaseClient";
import { AppContext } from "../App";

export default function QueryTest() {
  let { user } = useContext(AppContext);
  async function test() {
    let myClubs = await supabase
      .from("clubs")
      .select("*, club_memberships!inner(*)")
      .eq("club_memberships.user_id", user.id);

    console.clear();
    console.table(myClubs.data);

    let allClubs = await supabase
      .from("clubs")
      .select("*")
      .not(
        "club_id",
        "in",
        `(${myClubs.data.map((c) => c.club_id).join(",")})`
      );
    console.table(allClubs.data);
  }

  async function test2() {
    let allClubs = await supabase.rpc("get_all_clubs3", {
      user_id_in: user.id,
      page: 2,
      page_size: 2,
    });
    console.clear();
    console.log("test 2");
    console.table(allClubs.data);
  }

  return (
    <div>
      <button className="btn" onClick={test}>
        test
      </button>

      <button className="btn" onClick={test2}>
        test2
      </button>
    </div>
  );
}
