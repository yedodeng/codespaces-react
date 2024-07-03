import Modal from "../../../components/modal";
import useAnns from "../../../hooks/useAnns";
import Announcement from "../../../components/announcement";
import PageBtns from "../../../components/pagebtns";

export default function ManageAnns({ club_id }) {
  const page_size = 3;

  let { anns, annCnt, handleAddAnnouncement, handleEditAnnouncement,
    handleDeleteAnnouncement, page, setPage, showModal, setShowModal
  } = useAnns({ club_id, page_size });
  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold p-3">Announcements</div>
        <div className="space-y-3">
          {anns
          .filter((_, i) => page * page_size <= i && i <= page * page_size + page_size - 1)
          .map((a) => (
            <Announcement
              key={a.ann_id}
              announcement={a}
              handleDeleteAnnouncement={handleDeleteAnnouncement}
              handleEditAnnouncement={handleEditAnnouncement}
              isAdmin={true}
            />
          ))}
          <PageBtns cnt={annCnt} page={page} setPage={setPage} page_size={page_size}></PageBtns>
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
      <Modal show={showModal} close={() => setShowModal(false)} btn="Cancel">
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
            <div className="flex justify-center">
              <button className="btn btn-sm font-bold w-1/3 btn-primary">Submit</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}


