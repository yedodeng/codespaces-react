import supabase from "./supabaseClient";

export default function UserHome() {
    async function signOut() {
        supabase.auth.signOut();
      }
    return (
        <div>
      
      <button onClick = {signOut} className = "btn btn-error">
        Sign Out
      </button>
    </div>
    )
}