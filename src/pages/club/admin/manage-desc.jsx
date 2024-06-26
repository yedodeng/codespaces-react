import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function ManageDesc({ club_id }) {
    const { desc, handleUpdateDesc } = useDesc({ club_id });
    let [editDesc, setEditDesc] = useState(false);
    let [newDesc, setNewDesc] = useState("");
    let [oldDesc, setOldDesc] = useState("");
    
    useEffect(() => {
      setNewDesc(desc);
      setOldDesc(desc);
    }, [desc]);
  
    return (
      <div className="px-5 text-sm ">
        {!editDesc && <div className="my-2">{newDesc}</div>}
        {editDesc && (
          <textarea
            className="textarea textarea-bordered w-full my-2"
            value={newDesc}
            onChange={(ev) => setNewDesc(ev.target.value)}
          ></textarea>
        )}
        <div className="flex justify-end">
          {!editDesc ? (
            <button
              onClick={() => setEditDesc(true)}
              className="btn btn-sm btn-warning"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditDesc(false);
                  handleUpdateDesc(newDesc);
                }}
                className="btn btn-sm btn-success mx-4"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNewDesc(oldDesc);
                  setEditDesc(false);
                }}
                className="btn btn-sm btn-error"
              >
                Cancel
              </button>
            </>
          )}
        </div>
  
      </div>
    );
  }
  
  function useDesc({club_id}) {
    let [desc, setDesc] = useState();
  
    useEffect(() => {
      if (club_id) loadDesc();
    }, [club_id]);
  
    async function loadDesc() {
      let { data } = await supabase
        .from("clubs")
        .select("description")
        .eq("club_id", club_id)
        .single();
      setDesc(data.description);
    }
  
    async function handleUpdateDesc(newDesc) {
      const { data, error } = await supabase
        .from("clubs")
        .update({ description: newDesc })
        .eq("club_id", club_id);
      setDesc(newDesc);
    }
  
    return {desc, handleUpdateDesc};
  }