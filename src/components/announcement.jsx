import { useState } from "react";
import Modal from "./modal";

export default function Announcement({
    announcement,
    handleEditAnnouncement,
    handleDeleteAnnouncement,
    isAdmin
  }) {
    let [modalText, setModalText] = useState(null);
  
    return (
      <>
        <div className="space-y-3 bg-base-300 p-3 rounded ">
          <div>{announcement.text}</div>
          <div className="flex justify-between items-center">
            <div className="text-xs">
              {new Date(announcement.created_at).toDateString()}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs font-bold">{announcement.author}</div>
                {isAdmin && 
                <div className="space-x-2 ml-2">
                  <button
                    className="btn btn-xs btn-warning"
                    onClick={() => {
                      setModalText(announcement.text);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDeleteAnnouncement(announcement.ann_id)}
                  >
                    Delete
                  </button>
                </div>
            }
            </div>
          </div>
        </div>
        <Modal show={modalText} close={() => setModalText(null)}>
          {modalText && (
            <form
              className="w-full flex flex-col space-y-3"
              onSubmit={(ev) =>
                handleEditAnnouncement(
                  ev,
                  () => setModalText(null),
                  announcement.ann_id
                )
              }
            >
              <div className="font-bold text-center text-xl">
                Edit Announcement
              </div>
              <textarea
                defaultValue={modalText}
                className="textarea textarea-primary"
                name="text"
              ></textarea>
              <button className="btn btn-xs btn-primary">Submit</button>
            </form>
          )}
        </Modal>
      </>
    );
  }