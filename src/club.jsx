import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { supabase } from "./supabaseClient";
import { AppContext } from "./App";
import Modal from "./components/modal";

export default function Club() {
    let { user } = useContext(AppContext);
    let { club_id } = useParams();
    let [club, setClub] = useState(undefined);

    useEffect(() => {
        if (club_id) {
            handleLoadClub();
        }
    }, [])

    let role = club?.club_memberships.find(
        (mem) => mem.user_id == user.id
    )?.role;


    async function handleLoadClub() {
        const { data, error } = await supabase
            .from("clubs")
            .select("*, club_memberships(role, user_id, profiles(full_name, grad_year)), announcements(*)")
            .single()
            .eq("club_id", club_id)

        if (error) alert(club_id);
        // console.log(data);
        setClub(data);
    }


    if (typeof club == "undefined") return <div>Loading...</div>;

    return (
        <>
            <div>
                <div className="text-center text-3xl font-bold">{club ? club.name : ""}</div>
                <Description club={club} isAdmin={role == "Admin"} />
                <div className="text-center text-2xl font-bold p-3">Members</div>
                <Members club={club} role={role} reload={handleLoadClub} />
                {role != "Pending" ?
                    <div className="my-4">
                        <Announcements isAdmin={role == "Admin"} club={club} setClub={setClub} />
                        <div className="my-2">Events</div>
                    </div>
                    :
                    <div className="bold text-xl text-center my-4">Your application is currently pending</div>
                }
            </div>
        </>
    )
}

function Description({ club, isAdmin }) {
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
            {isAdmin &&
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

function Members({ club, role, reload }) {
    async function handleUpdateRole(user_id, role) {
        const { error } = await supabase
            .from("club_memberships")
            .update({ role, })
            .eq("club_id", club.club_id)
            .eq("user_id", user_id)
        console.log("yes");
        // setClub({
        // ...club, 
        // club_memberships: club.club_memberships.map((m) =>
        // m.user_id == user_id ? {...m, role : role} : m
        // )
        // })
        reload();
    }

    async function handleDelete(user_id) {
        const { error } = await supabase
            .from("club_memberships")
            .delete()
            .eq("user_id", user_id)
        reload();
    }

    return (
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
                    {club ? club.club_memberships.filter((m) => m.role != "Pending" || role == "Admin").map((mem, i) => (
                        <tr key={mem.user_id}>
                            <th>{i + 1}</th>
                            <td>{mem.profiles.full_name}</td>
                            <td>{mem.profiles.grad_year}</td>
                            <td>
                                {role == "Admin" ?
                                    mem.role == "Pending" ?
                                        <div className="flex items-center space-x-4">
                                            <div>Pending</div>
                                            <button className="btn btn-xs btn-success mr-4"
                                                onClick={() => handleUpdateRole(mem.user_id, "Member")}>Approve
                                            </button>
                                            <button className="btn btn-xs btn-error"
                                                onClick={() => handleDelete(mem.user_id)}>Reject
                                            </button>
                                        </div>

                                        : mem.role == "Member" ?
                                            <div className="flex items-center space-x-4">
                                                <select className="select select-primary select-xs"
                                                    defaultValue={mem.role}
                                                    onChange={(ev) => handleUpdateRole(mem.user_id, ev.target.value)}>
                                                    <option value="Member">Member</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                <button className="btn btn-xs btn-error"
                                                    onClick={() => handleDelete(mem.user_id)}>Remove
                                                </button>
                                            </div>
                                            :
                                            <select className="select select-primary select-xs"
                                                defaultValue={mem.role}
                                                onChange={(ev) => handleUpdateRole(mem.user_id, ev.target.value)}>
                                                <option value="Member">Member</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                    : mem.role
                                }

                            </td>
                        </tr>
                    )) : ""}
                </tbody>
            </table>
        </div>
    )
}

function Announcements({ isAdmin, club, setClub }) {
    let [showModal, setShowModal] = useState(false);
    let { user } = useContext(AppContext);

    let announcements = club.announcements;
    announcements.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
    async function handleAddAnnouncement(ev) {
        ev.preventDefault();
        let obj = {
            club_id: club.club_id,
            text: ev.target.text.value,
            author: user.full_name
        }
        const { data, error } = await supabase
            .from("announcements")
            .insert(obj)
            .select()
            .single()

        setClub({ ...club, announcements: [...club.announcements, data] });
        setShowModal(false)
    }

    return (
        <>
            <div>
                <div className="text-center text-2xl font-bold p-3">Announcements</div>
                <div className="space-y-3">
                    {club.announcements.map((a) => <Announcement key={a.ann_id} announcements={a} />)}
                    {isAdmin &&
                        <div className="flex justify-end">
                            <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>Add Announcement</button>
                        </div>
                    }
                </div>
            </div>
            <Modal show={showModal} close={() => setShowModal(false)}>
                {showModal &&
                    <form className="w-full flex flex-col space-y-3" onSubmit={handleAddAnnouncement}>
                        <div className="font-bold text-center text-xl">Add Announcement</div>
                        <textarea className="textarea textarea-primary" name="text"></textarea>
                        <button className="btn btn-xs btn-primary">Submit</button>
                    </form>
                }
            </Modal>
        </>
    )
}

function Announcement({ announcements, handleEditAnnouncement, handleDeleteAnnouncement }) {
    return (
        <div className="space-y-3 bg-base-300 p-3 rounded ">
            <div>{announcements.text}</div>
            <div className="flex justify-between items-center">
                <div className="text-xs">{new Date(announcements.created_at).toDateString()}</div>
                <div className="text-xs font-bold">{announcements.author}</div>
            </div>
        </div>
    )
}

