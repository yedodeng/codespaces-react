import { useState } from "react";
import Modal from "../../../components/modal";
import useAnns from "../../../hooks/useAnns";

export default function ManageAnns({ club_id }) {
  const page_size = 3;

  let { anns, annCnt, handleAddAnnouncement, handleEditAnnouncement, 
    handleDeleteAnnouncement, page, setPage, showModal, setShowModal
   } = useAnns({ club_id, page_size});

  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold p-3">Announcements</div>
        <div className="space-y-3">
          {anns?.filter(
              (_, i) =>
                page * page_size <= i && i <= page * page_size + page_size - 1
            )
            .map((a) => (
              <Announcement
                key={a.ann_id}
                announcement={a}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
                handleEditAnnouncement={handleEditAnnouncement}
              />
            ))}
          <div className="flex justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page == 0}
              className="btn btn-neutral btn-sm"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page == Math.ceil(annCnt / page_size) - 1}
              className="btn btn-neutral btn-sm"
            >
              Next
            </button>
          </div>
            <div className="flex justify-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowModal(true)}
              >
                Add Announcement
              </button>
            </div>
        </div>
      </div>
      <Modal show={showModal} close={() => setShowModal(false)}>
        {showModal && (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={handleAddAnnouncement}
          >
            <div className="font-bold text-center text-xl">
              Add Announcement
            </div>
            <textarea
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


function Announcement({
  announcement,
  handleEditAnnouncement,
  handleDeleteAnnouncement
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