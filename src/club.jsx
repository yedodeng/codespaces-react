import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { supabase } from "./supabaseClient";
import { AppContext } from "./App";

export default function Club() {
    let { user } = useContext(AppContext);
    let { club_id } = useParams();
    let [club, setClub] = useState(undefined);

    useEffect(() => {
        if (club_id) {
            handleLoadClub();
        }
    }, [])

    async function handleLoadClub() {
        const { data, error } = await supabase
            .from("clubs")
            .select("*, club_memberships(role, user_id, profiles(full_name, grad_year))")
            .single()
            .eq("club_id", club_id)

        if (error) alert(club_id);
        console.log(data);
        setClub(data);
    }

    async function handleUpdateRole(user_id, role) {
        const { error } = await supabase
            .from("club_memberships")
            .update({ role, })
            .eq("club_id", club_id)
            .eq("user_id", user_id)
    }

    if (typeof club == "undefined") return <div>Loading...</div>;

    return (
        <div>
            <div className="text-center text-2xl font-bold">{club ? club.name : ""}</div>
            <Description club={club} club_id={club_id} />
            <div className="text-center xl font-bold p-3">Members</div>
            <div className="overflow-x-auto bg-base-100 rounded">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Graduation Year</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {club ? club.club_memberships.map((mem, i) => (
                            <tr key={mem.user_id}>
                                <th>{i + 1}</th>
                                <td>{mem.profiles.full_name}</td>
                                <td>{mem.profiles.grad_year}</td>
                                <td>
                                    {user.roles.is_admin ?
                                        <select className="select select-primary select-xs"
                                            defaultValue={mem.role}
                                            onChange={(ev) => handleUpdateRole(mem.user_id, ev.target.value)}>
                                            <option value="Member">Member</option>
                                            <option value="Admin">Admin</option>
                                        </select> : mem.role}
                                </td>
                            </tr>
                        )) : ""}
                    </tbody>

                </table>
            </div>
            <div className="my-4">Announcements</div>
            <div>Events</div>
        </div>
    )
}

function Description({ club }) {
    let { user } = useContext(AppContext);
    let [editDesc, setEditDesc] = useState(false);
    let [newDesc, setNewDesc] = useState(club.description);
    let [oldDesc, setOldDesc] = useState(club.description);
    async function handleUpdateDesc(description) {
        const { data, error } = await supabase
            .from("clubs")
            .update({ description: newDesc })
            .eq("club_id", club.club_id)
        setOldDesc(newDesc);
    }

    return (
        <div className="px-5 text-sm">
            {!editDesc && <div className="my-2">{newDesc}</div>}
            {editDesc &&
                <textarea className="textarea textarea-bordered w-full my-2"
                    value={newDesc}
                    onChange={(ev) => setNewDesc(ev.target.value)}>
                </textarea>
            }
            {user.roles.is_admin ??
                <div className="flex justify-end">
                    {!editDesc ?
                        <button
                            onClick={() => setEditDesc(true)}
                            className="btn btn-sm btn-warning"
                        >
                            Edit
                        </button>
                        :
                        <>
                            <button
                                onClick={() => { setEditDesc(false); handleUpdateDesc() }}
                                className="btn btn-sm btn-success mx-4"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => { setEditDesc(false); setNewDesc(oldDesc) }}
                                className="btn btn-sm btn-error"
                            >
                                Cancel
                            </button>
                        </>
                    }
                </div>
            }
        </div>
    )
}