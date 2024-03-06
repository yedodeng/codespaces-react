import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./auth";
import UserHome from "./home";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import About from "./about";
// import {supabase} from 

export const AppContext = createContext(null);

export default function App() {
  let [user, setUser] = useState(undefined);
  const loadUserData = async (userId) => {
    const { data } = await supabase.from("profiles").select("*, roles(*)").eq("id", userId).single();
    setUser(data);
  };


  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // signed
        loadUserData(session.user.id);
      } else {
        // signed out
        setUser(undefined)
      }
    })
  }, [])


  async function signOut() {
    supabase.auth.signOut();
  }

  return (
    <div>
      <AppContext.Provider value={{ user }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<UserHome />}></Route>
            <Route path="/about" element={<About />}></Route>
          </Route>
        </Routes>
      </AppContext.Provider>
    </div>
  )
}

function Layout() {
  let { user } = useContext(AppContext);
  async function signOut() {
    supabase.auth.signOut();
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center border-primary border-b p-5 space-x-5">
        <div className="text-xl font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="text-xl font-bold flex-grow">
          <Link to="/about">About Us</Link>
        </div>
        {user && (<div><button onClick={signOut} className="btn btn-error btn-small">
          Sign Out
        </button></div>)}
      </div>
      <div className="flex-grow bg-white p-5">{user ? <Outlet /> : <Auth />}</div>
    </div>
  )
}

