import { useContext, useState } from "react";
import Modal from "./modal";
import { AppContext } from "../App";

export default function Event({
  event,
  handleEditEvent,
  handleDeleteEvent,
  userIdNameMap,
  handleReserveEvent,
  isAdmin
}) {
  let { user } = useContext(AppContext);
  let [modalText, setModalText] = useState(null);
  let [showReserv, setShowReserv] = useState(false);
  let date = new Date(event.date);
  let ar = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let m = ar[date.getMonth()];
  let d = date.getDate();
  let t = date.toTimeString().substring(0, 5);
  let p =
    date.toLocaleTimeString().substring(0, 4) +
    " " +
    date.toLocaleTimeString().substring(8, 11);
  date = `${m} ${d}`;

  let reserved = event.event_reservations?.find((e) => e.user_id == user.id);

  return (
    <>
      <div className="space-y-3 bg-base-300 p-3 rounded ">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xl">{event.title}</div>
          <div className="text-sm">On {`${p}, ${date}`}</div>
        </div>
        <div>{event.text}</div>
        <div className="flex justify-between items-center">
          {isAdmin ? (
            <button
              onClick={() => setShowReserv(true)}
              className="bg-neutral rounded-full w-8 h-8 text-gray-100 flex items-center justify-center font-bold text-sm"
            >
              {event.event_reservations ? event.event_reservations.length : 0}
            </button>) : <button
              onClick={() => handleReserveEvent(event.ev_id, reserved, user.id)}
              className={`btn btn-sm ${reserved ? "btn-error" : "btn-primary"}`}
            >
            {reserved ? "Cancel RSVP" : "RSVP"}
          </button>
          }
          <div className="flex items-center space-x-2">
            <div className="text-xs font-bold">{event.author}</div>
            {isAdmin && <div className="space-x-2 ml-2">
              <button
                className="btn btn-xs btn-warning"
                onClick={() => {
                  setModalText(event.text);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error"
                onClick={() => handleDeleteEvent(event.ev_id)}
              >
                Delete
              </button>
            </div>}
          </div>
        </div>
      </div>
      <Modal show={showReserv} close={() => setShowReserv(false)} btn="Done">
        {showReserv && (
          <div>
            <div className="text-xl text-center font-bold">RSVPs</div>
            <div className="grid grid-cols-4">
              {event.event_reservations?.length > 0 ? event.event_reservations.map((r) => (
                <div className="text-center" key={r.user_id}>
                  {userIdNameMap.get(r.user_id)}
                </div>
              ))
                : <div className="text-xl">No RSVPs </div>
              }
            </div>
          </div>
        )}
      </Modal>
      <Modal show={modalText} close={() => setModalText(null)} btn="Cancel">
        {modalText && (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={(ev) =>
              handleEditEvent(ev, () => setModalText(null), event.ev_id)
            }
          >
            <div className="font-bold text-center text-xl">Edit Event</div>
            <label>Event Title</label>
            <input
              defaultValue={event.title}
              type="text"
              name="title"
              className="input input-sm input-primary"
            />
            <lable>Event Description</lable>
            <textarea
              defaultValue={event.text}
              className="textarea textarea-primary"
              name="text"
            ></textarea>
            <label>Event Date & Time</label>
            <input
              defaultValue={date}
              type="date"
              name="date"
              className="input input-sm input-primary"
            />
            <input
              defaultValue={t}
              type="time"
              name="time"
              className="input input-sm input-primary"
            />
            <button className="btn btn-xs btn-primary">Submit</button>
          </form>
        )}
      </Modal>
    </>
  );
}