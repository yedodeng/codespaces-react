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
}

function SignUp() {
  let [error, setError] = useState(null);


  async function signUp(ev) {
    ev.preventDefault();
    setError(null)
    const data = {
      email: ev.target["email"].value,
      password: ev.target["password"].value,
      options: {
        data: {
          full_name: ev.target["full_name"].value,
          grad_year: parseInt(ev.target["grad_year"].value),
        },
      },
    };
    let { error } = await supabase.auth.signUp(data);

    if (error) setError(error.message);
  }

  return (
    <div className="text-center text-xl mb-2"> Sign Up
      <form className="flex flex-col items-center space-y-2" onSubmit={signUp}>
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
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Full Name</span>
          </div>
          <input type="text" name="full_name" placeholder="John Doe" className="input input-bordered w-full max-w-xs" />
          <div className="label">
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Grade</span>
          </div>
          <select className="select select-bordered w-full max-w-xs" name="grad_year">
            <option defaultValue="2027">Freshman</option>
            <option value="2026">Sophmore</option>
            <option value="2025">Junior</option>
            <option value="2024">Senior</option>
            <option value="1">N/A</option>
          </select>
          <div className="label">
          </div>
        </label>
        <button className="btn btn-sm btn-primary">
          Sign Up
        </button>
      </form>
      {error && <div className="text-error text-center mt-2">{error}</div>}
    </div>
  )
}

function SignIn() {
  let [error, setError] = useState(null);
  async function signIn(ev) {
    ev.preventDefault();

    setError(null);
    const bol = true;
    let { error } = await supabase.auth.signInWithPassword({
      email: bol ? "yedo@btreecode.com" : ev.target.email.value,
      password: bol ? "yedoyedo" : ev.target.password.value,
    })
    if (error) console.log(error.message);
    if (error) setError(error.message);
  }

  return (
    <div className="text-center text-xl mb-2"> Sign In
      <form className="flex flex-col items-center space-y-2" onSubmit={signIn}>
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
      {error && <div className="text-error text-center m-2">{error}</div>}
    </div>
  )
}
