import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./auth";
import UserHome from "./home";


export default function App() {
  let [user, setUser] = useState(undefined);

  useEffect(() => {
      supabase.auth.onAuthStateChange((_event, session) =>{
        if(session) {
          // signed
          setUser(session.user);
        } else {
          // signed out
          setUser(undefined)
        }
    })
  }, [])

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

  async function signOut() {
    supabase.auth.signOut();
  }

  return (
    <div>123</div>
  )
}