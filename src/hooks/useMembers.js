import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useMembers({ club_id }) {
    let [members, setMembers] = useState([]);
    useEffect(() => {
        if (club_id) loadMembers();
    }, [club_id]);

    async function loadMembers() {
        let { data } = await supabase
            .from("club_memberships")
            .select("*, profiles(grad_year, full_name)")
            .eq("club_id", club_id)
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
        loadMembers();
    }

    return { members, setMembers, handleDelete, handleUpdateRole };
}