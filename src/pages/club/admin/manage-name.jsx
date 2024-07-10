import { useEffect, useState } from "react";
import useName from "../../../hooks/useName";

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
            Edit Name
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

