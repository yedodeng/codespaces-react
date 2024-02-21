import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  return (
    <div className="border border-primary p-5 rounded-lg m-2">
      <SignUp />
      <div className="divider divider-primary"></div>
      <SignIn />
    </div>
  )

  function SignUp() {
    let [error, setError] = useState(null);

    async function signUp(ev) {

      setError(null)
      let { error } = await supabase.auth.signUp({
        email: "yedoipark@gmail.com",
        password: "123123",
      });

      if (error) setError(error.message);
    }

    return (
      <div className = "text-center text-xl mb-2"> Sign Up
      <form className = "flex flex-col items-center space-y-2" onSubmit={signUp}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">E-Mail</span>
          </div>
          <input type="email" name="email" placeholder="name@domain.com" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input type="password" name="password" placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
        <button className="btn btn-sm btn-primary">
          Sign Up
        </button>
      </form>
      {error && <div className = "text-error text-center mt-2">{error}</div>}
      </div>
    )
  }

  function SignIn() {
    let [error, setError] = useState(null);
    async function signIn(ev) {
      //setError(null);

      let { error } = await supabase.auth.signInWithPassword({
        email: "yedoipark@gmail.com",
        password: "123123",
      })
      if (error) console.log(error.message);
      //if (error) setError(error);
    }

    return (
      <div className = "text-center text-xl mb-2"> Sign In
      <form className = "flex flex-col items-center space-y-2" onSubmit={signIn}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">E-Mail</span>
          </div>
          <input type="email" name="email" placeholder="name@domain.com" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input type="password" name="password" placeholder="" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
        <button className="btn btn-sm btn-primary">
          Sign In
        </button>
      </form>
      {error ? <div>Yes Error</div> : <div>No Error</div>}
      </div>
    )
  }

}