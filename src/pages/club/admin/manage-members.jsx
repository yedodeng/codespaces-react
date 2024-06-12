import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { Link } from "react-router-dom";

export default function ManageMembers({ club_id }) {

    const { members, handleDelete, handleUpdateRole } = useMembers({ club_id });

    return (
        <>
        <div className="text-center text-2xl font-bold p-3">Members</div>
        <div className="overflow-x-auto bg-base-100 rounded">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Graduation Year</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {members
                        .filter((m) => m.role != "Pending" || role == "Admin")
                        .map((mem, i) => (
                            <tr key={mem.user_id}>
                                <th>{i + 1}</th>
                                <td>
                                    <Link to={`/profile/${mem.user_id}`}>
                                        {mem.profiles.full_name}
                                    </Link>
                                </td>
                                <td>{mem.profiles.grad_year}</td>
                                <td>
                                    {mem.role == "Pending" ? (
                                        <div className="flex items-center space-x-4">
                                            <div>Pending</div>
                                            <button
                                                className="btn btn-xs btn-success mr-4"
                                                onClick={() =>
                                                    handleUpdateRole(mem.user_id, "Member")
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => handleDelete(mem.user_id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : mem.role == "Member" ? (
                                        <div className="flex items-center space-x-4">
                                            <select
                                                className="select select-primary select-xs"
                                                defaultValue={mem.role}
                                                onChange={(ev) =>
                                                    handleUpdateRole(mem.user_id, ev.target.value)
                                                }
                                            >
                                                <option value="Member">Member</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => handleDelete(mem.user_id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            className="select select-primary select-xs"
                                            defaultValue={mem.role}
                                            onChange={(ev) =>
                                                handleUpdateRole(mem.user_id, ev.target.value)
                                            }
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    )
                                    }
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
        </>
    );
}


function useMembers({ club_id }) {
    let [members, setMembers] = useState([]);

    useEffect(() => {
        if (club_id) loadMembers();
    }, [club_id]);

    async function loadMembers() {
        let { data } = await supabase
            .from("club_memberships")
            .select("*, profiles(grad_year, full_name)")
            .eq("club_id", club_id)
            .limit(10);

        setMembers(data);
    }

    async function handleDelete(user_id) {
        const { error } = await supabase
            .from("club_memberships")
            .delete()
            .eq("user_id", user_id);
        loadMembers();
    }
    async function handleUpdateRole(user_id, role) {
        const { error } = await supabase
            .from("club_memberships")
            .update({ role })
            .eq("club_id", club_id)
            .eq("user_id", user_id);
        console.log("yes");
        loadMembers();
    }

    return { members, setMembers, handleDelete, handleUpdateRole };
}
