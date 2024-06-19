import {useState }  from "react";
import Modal from "../../../components/modal";
import useUserIdNameMap from "../../../hooks/useUserIdNameMap";
import useEvents from "../../../hooks/useEvents";

export default function ManageEvents({ club_id }) {
    const page_size = 3;
    let {events, evCnt, page, setPage, handleAddEvent,  
        handleEditEvent, handleDeleteEvent, showModal,
        setShowModal, } = useEvents({club_id, page_size});
    let userIdNameMap = useUserIdNameMap({club_id});

    return (
        <>
            <div>
                <div className="text-center text-2xl font-bold p-3">Events</div>
                <div className="space-y-3">
                    {events
                        .filter(
                            (_, i) =>
                                page * page_size <= i && i <= page * page_size + page_size - 1
                        )
                        .map((a) => (
                            <Event
                                key={a.ev_id}
                                event={a}
                                handleDeleteEvent={handleDeleteEvent}
                                userIdNameMap={userIdNameMap}
                                handleEditEvent={handleEditEvent}
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
                            disabled={page == Math.ceil(evCnt / page_size) - 1}
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
                                Add Event
                            </button>
                        </div>
                </div>
            </div>
            <Modal show={showModal} close={() => setShowModal(false)}>
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
                        <button className="btn btn-xs btn-primary">Submit</button>
                    </form>
                )}
            </Modal>
        </>
    );
}

function Event({
    event,
    handleEditEvent,
    handleDeleteEvent,
    userIdNameMap,
}) {
    let [modalText, setModalText] = useState(null);
    let [showReserv, setShowReserv] = useState(false);
    let date = new Date(event.date);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let t = date.toTimeString().substring(0, 5);
    let p =
        date.toLocaleTimeString().substring(0, 4) +
        " " +
        date.toLocaleTimeString().substring(8, 11);
    date = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;

    // console.log(userIdNameMap);

    return (
        <>
            <div className="space-y-3 bg-base-300 p-3 rounded ">
                <div className="flex justify-between items-center">
                    <div className="font-bold text-xl">{event.title}</div>
                    <div className="text-sm">At {`${p} ${date}`}</div>
                </div>
                <div>{event.text}</div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowReserv(true)}
                                className="bg-neutral rounded-full w-8 h-8 text-gray-100 flex items-center justify-center font-bold text-sm"
                            >
                                {event.event_reservations?.length}
                            </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-xs font-bold">{event.author}</div>
                            <div className="space-x-2 ml-2">
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
                            </div>
                    </div>
                </div>
            </div>
            <Modal show={showReserv} close={() => setShowReserv(false)}>
                {showReserv && (
                    <div>
                        <div className="text-xl text-center font-bold">RSVPs</div>
                        <div className="grid grid-cols-4">
                            {event.event_reservations?.length > 0 ? event.event_reservations.map((r) => (
                                <div className="text-center" key={r.user_id}>
                                    {userIdNameMap.get(r.user_id)}
                                </div>
                            ))
                        : <div className = "text-xl">No RSVPs </div>
                        }
                        </div>
                    </div>
                )}
            </Modal>
            <Modal show={modalText} close={() => setModalText(null)}>
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