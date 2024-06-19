import Modal from "../../../components/modal";
import useAnns from "../../../hooks/useAnns";
import Announcement from "../../../components/announcement";

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
                isAdmin={true}
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


