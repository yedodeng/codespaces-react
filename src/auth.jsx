import supabase from "./supabaseClient";

export default function Auth() {
    async function signUp() {
        let {error} = await supabase.auth.signUp({ 
          email : "abc@gmail.com",
          password : "abcabc",
        });
    
        if (error) console.log(error.message);
      }
    
      async function signIn() {
        let {error} = await supabase.auth.signInWithPassword({
          email : "abc@gmail.com",
          password : "abcabc",
        })
        if (error) console.log(error.message);
      }
    return ( 
    <div>
    <button onClick = {signUp} className = "btn btn-primary">
    Sign Up
  </button>
  <button onClick = {signIn} className = "btn btn-primary">
    Sign In
  </button>
  </div>
    )
}