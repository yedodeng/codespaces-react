import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function ManageName({ club_id }) {
    const { name, handleUpdateName } = useName({ club_id });
  
    let [editName, setEditName] = useState(false);
    let [newName, setNewName] = useState("");
    let [oldName, setOldName] = useState("");
    
    useEffect(() => {
      setNewName(name);
      setOldName(name);
    }, [name]);
  
    return (
      <div className="px-5 text-center text-3xl font-bold">
        {!editName && <div className="my-2">{newName}</div>}
        {editName && (
          <textarea
            className="textarea textarea-bordered w-full my-2"
            value={newName}
            onChange={(ev) => setNewName(ev.target.value)}
          ></textarea>
        )}
        <div className="flex justify-end">
          {!editName ? (
            <button
              onClick={() => setEditName(true)}
              className="btn btn-sm btn-warning"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditName(false);
                  handleUpdateName(newName);
                }}
                className="btn btn-sm btn-success mx-4"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditName(false);
                  setNewName(oldName);
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
  
  function useName({club_id}) {
    let [name, setName] = useState();
  
    useEffect(() => {
      if (club_id) loadName();
    }, [club_id]);
  
    async function loadName() {
      let { data } = await supabase
        .from("clubs")
        .select("name")
        .eq("club_id", club_id)
        .single();
      setName(data.name);
    }
  
    async function handleUpdateName(newName) {
      const { data, error } = await supabase
        .from("clubs")
        .update({ name: newName })
        .eq("club_id", club_id);
      setName(newName);
    }
  
    return {name, handleUpdateName};
  }