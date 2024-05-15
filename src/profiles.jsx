import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "./App";
import { supabase } from "./supabaseClient";

export default function Profile() {
    let { user_id } = useParams();
    let {user} = useContext(AppContext)
    let [profile, setProfile] = useState(null);
    let [edit, setEdit] = useState(false);

    useEffect(() => {
        if (user_id) handleLoadProfile();
    }, [user_id])

    async function handleLoadProfile() {
        let { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("id", user_id).single();
        setProfile(data);
        console.log(data);
    }

    async function handleUpdateProfile(column, newValue) {
        const { error } = await supabase
            .from("profiles")
            .update({
                [column]: newValue
            })
            .eq("id", user_id);

        setProfile({
            ...profile,
            [column]: newValue,
        })
    }

    if (!profile) return <div>Loading...</div>;
    return (
        <>
            <div className="flex">
                <div className="w-1/3 flex flex-col items-center ">
                    <img src={profile?.profile_picture ||
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"}
                    />
                    {edit &&
                        <button onClick={() => {
                            let newUrl = prompt("Enter a new image url: ");
                            handleUpdateProfile("profile_picture", newUrl);
                            setEdit(false);
                        }}
                            className="btn btn-xs my-2 btn-neutral">Upload Image</button>}
                </div>
                <div className="flex-grow p-3">
                    <div className="flex space-x-2 items-center">
                        <strong>Name: </strong>
                        {edit ?
                            <form onSubmit={(ev) => {
                                ev.preventDefault();
                                handleUpdateProfile("full_name", ev.target.full_name.value);
                                setEdit(false)
                            }} >
                                <input name="full_name" className="input input-sm input-primary rounded-tr-none rounded-br-none" />
                                <button className="btn btn-sm btn-primary rounded-tl-none rounded-bl-none">Save</button>
                            </form>
                            : <div>{profile.full_name}
                            </div>}
                    </div>
                    <div className="flex space-x-2 items-center">
                        <strong>Graduation Year: </strong>
                        {edit ?
                            <form onSubmit={(ev) => {
                                ev.preventDefault();
                                handleUpdateProfile("grad_year", ev.target.grad_year.value);
                                setEdit(false);
                            }} >
                                <input type="number" name="grad_year" className="input input-sm input-primary rounded-tr-none rounded-br-none" />
                                <button className="btn btn-sm btn-primary rounded-tl-none rounded-bl-none">Save</button>
                            </form>
                            : <div>{profile.grad_year}
                            </div>}
                    </div>
                </div>
            </div>
            {
                user_id == user?.id && (
                    !edit ?
                        <div className={edit ? "flex justify-end" : "flex justify-end my-10"}>
                            <button
                                onClick={() => setEdit(true)}
                                className="btn btn-sm btn-warning"
                            >
                                Edit
                            </button>
                        </div>
                        :
                        <div className='flex justify-end'>
                            <button
                                onClick={() => { setEdit(false); }}
                                className="btn btn-sm btn-error"
                            >
                                Cancel
                            </button>
                        </div>

                )
            }
        </>
    )
}