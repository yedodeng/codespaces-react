import { useEffect, useState, useTransition } from "react";
import { supabase } from "../../../supabaseClient";
import Modal from "../../../components/modal";

export default function ManageAnns({ club_id }) {
  let [showModal, setShowModal] = useState(false);
  let [page, setPage] = useState(0);

  const { anns, annCnt, handleLoadAnnouncementCnt, handleLoadAnnouncements,
          handleAddAnnouncement, handleEditAnnouncement, handleDeleteAnnouncement
   } = useAnns({ club_id });


  console.log(anns);
  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold p-3">Announcements</div>
        <div className="space-y-3">
          {anns
            .filter(
              (_, i) =>
                page * page_size <= i && i <= page * page_size + page_size - 1
            )
            .map((a) => (
              <Announcement
                key={a.ann_id}
                announcement={a}
                isAdmin={isAdmin}
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
          {isAdmin && (
            <div className="flex justify-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowModal(true)}
              >
                Add Announcement
              </button>
            </div>
          )}
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

function useAnns({ club_id }) {
  let [anns, setAnns] = useState();
  let [annCnt, setAnnCnt] = useState(0);

  useEffect(() => {
    if (club_id) handleLoadAnnouncements();
  }, [club_id]);

  async function handleLoadAnnouncementCnt() {
    const { count, error } = await supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .eq("club_id", club.club_id);

    setAnnCnt(count);
  }

  async function handleLoadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * page_size, page * page_size + page_size - 1);
    
    console.log([...anns, ...data]);

    setAnns([...anns, ...data]);
  }

  async function handleAddAnnouncement(ev) {
    ev.preventDefault();
    let obj = {
      club_id: club.club_id,
      text: ev.target.text.value,
      author: user.full_name,
    };
    const { data, error } = await supabase
      .from("announcements")
      .insert(obj)
      .select()
      .single();

    setAnns([...anns, data]);
    setShowModal(false);
  }

  async function handleEditAnnouncement(ev, close, ann_id) {
    ev.preventDefault();

    const { error } = await supabase
      .from("announcements")
      .update({ text: ev.target.text.value })
      .eq("ann_id", ann_id);

    setAnns(
      anns.map((a) =>
        a.ann_id == ann_id ? { ...a, text: ev.target.text.value } : a
      ),
    );
  }

  async function handleDeleteAnnouncement(ann_id) {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("ann_id", ann_id);

    setAnns(anns.filter((a) => a.ann_id != ann_id),);
  }

  return { anns, handleLoadAnnouncementCnt, annCnt,
    handleLoadAnnouncements, handleAddAnnouncement, 
    handleEditAnnouncement, handleDeleteAnnouncement};
}

function Announcement({
  announcement,
  handleEditAnnouncement,
  handleDeleteAnnouncement,
  isAdmin,
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
            {isAdmin && (
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
            )}
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