import { useEffect, useState, createContext } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./auth";
import UserHome from "./home";
import { Routes, Route } from "react-router-dom";

export const AppContext = createContext(null);

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
    <div>
      <AppContext.Provider value = {{user}}>
      <Routes>
        <Route path = "/" element = {<Layout/>}>
        <Route path = "/" element = {<UserHome/>}></Route>
        <Route path = "/auth" element = {<Auth/>}></Route>
        </Route>
      </Routes>
      </AppContext.Provider>
    </div>
  )
}

function Layout() {
  return (
    <div>123</div>
  )
}

