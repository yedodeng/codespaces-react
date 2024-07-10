import Modal from "../../../components/modal";
import useUserIdNameMap from "../../../hooks/useUserIdNameMap";
import useEvents from "../../../hooks/useEvents";
import Event from "../../../components/event";
import PageBtns from "../../../components/pagebtns";

export default function ManageEvents({ club_id }) {
  const page_size = 3;
  let { events, evCnt, page, setPage, handleAddEvent,
    handleEditEvent, handleDeleteEvent, showModal,
    setShowModal, } = useEvents({ club_id, page_size });
  let userIdNameMap = useUserIdNameMap({ club_id });

  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold p-3">Events</div>
        {events.length > 0 ?
        <div className="space-y-3">
          {events
            .filter((_, i) => page * page_size <= i && i <= page * page_size + page_size - 1)
            .map((a) => (
              <Event
                key={a.ev_id}
                event={a}
                handleDeleteEvent={handleDeleteEvent}
                userIdNameMap={userIdNameMap}
                handleEditEvent={handleEditEvent}
                isAdmin={true}
              />
            ))}
          <PageBtns cnt={evCnt} page={page} setPage={setPage} page_size={page_size}></PageBtns>
          <div className="flex justify-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowModal(true)}
            >
              Add Event
            </button>
          </div>
        </div> : 
        <div className="space-y-3">
        <div className="text-center text-xl">No Events Coming Up</div>
        <div className="flex justify-center">
        <button
            className="btn btn-md btn-primary w-1/3 text-lg"
            onClick={() => setShowModal(true)}
          >
            Add Event
        </button>
        </div>
      </div> 
      }
      </div> 
      
      <Modal show={showModal} close={() => setShowModal(false)} btn="Cancel">
        {showModal && (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={handleAddEvent}
          >
            <div className="font-bold text-center text-xl">Add Event</div>
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              className="input input-sm input-primary"
            />
            <lable>Event Description</lable>
            <textarea
              className="textarea textarea-primary"
              name="text"
            ></textarea>
            <label>Event Date & Time</label>
            <input
              type="date"
              name="date"
              className="input input-sm input-primary"
            />
            <input
              type="time"
              name="time"
              className="input input-sm input-primary"
            />
            <div className="flex justify-center">
              <button className="btn btn-sm font-bold w-1/3 btn-primary">Submit</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
