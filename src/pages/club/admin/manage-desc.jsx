import { useEffect, useState } from "react";
import useDesc from "../../../hooks/useDesc";

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
      {!editDesc && <div className="my-2">{newDesc ? newDesc : "Description Example Here"}</div>}
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
            Edit Desc
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
