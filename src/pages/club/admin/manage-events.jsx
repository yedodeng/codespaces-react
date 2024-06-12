import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import Modal from "../../../components/modal";
import { supabase } from "../../../supabaseClient";


export default function ManageEvents({ club_id, userIdNameMap }) {
    let {events, evCnt, page, setPage, handleAddEvent,  
        handleEditEvent, handleDeleteEvent, showModal,
        setShowModal, } = useEvents(club_id);

    return (
        <>
            <div>
                <div className="text-center text-2xl font-bold p-3">Events</div>
                <div className="space-y-3">
                    {club.events
                        .filter(
                            (_, i) =>
                                page * page_size <= i && i <= page * page_size + page_size - 1
                        )
                        .map((a) => (
                            <Event
                                key={a.ev_id}
                                event={a}
                                isAdmin={isAdmin}
                                handleDeleteEvent={handleDeleteEvent}
                                userIdNameMap={userIdNameMap}
                                handleEditEvent={handleEditEvent}
                                handleReserveEvent={handleReserveEvent}
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
                    {isAdmin && (
                        <div className="flex justify-end">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                Add Event
                            </button>
                        </div>
                    )}
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

function useEvents({ club_id }) {
    let [events, setEvents] = useState([]);
    let [evCnt, setEvCnt] = useState(0);
    let [page, setPage] = useState(0);
    let user = useContext(AppContext);
    useEffect(() => {
        if (club_id) handleLoadEvents();
    }, [page]);

    useEffect(() => {
        if (club_id) handleLoadEvCnt();
    }, [club_id]);

    async function handleLoadEvCnt() {
        const { count, error } = await supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("club_id", club.club_id);
        setEvCnt(count);
    }

    async function handleLoadEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false })
            .range(page * page_size, page * page_size + page_size - 1);

        setEvents([...club.events, ...data]);
    }

    async function handleAddEvent(ev) {
        ev.preventDefault();

        let date = new Date(`${ev.target.date.value} ${ev.target.time.value}`);
        let obj = {
            club_id: club.club_id,
            text: ev.target.text.value,
            author: user.full_name,
            title: ev.target.title.value,
            date,
        };
        const { data, error } = await supabase
            .from("events")
            .insert(obj)
            .select()
            .single();

        setEvents([data, ...events]);
        setShowModal(false);
    }

    async function handleEditEvent(ev, ev_id) {
        ev.preventDefault();
        let date = new Date(`${ev.target.date.value} ${ev.target.time.value}`);
        const { error } = await supabase
            .from("events")
            .update({
                text: ev.target.text.value,
                title: ev.target.title.value,
                date,
            })
            .eq("ev_id", ev_id);

        setEvents(events.map((a) =>
                a.ev_id == ev_id
                    ? {
                        ...a,
                        text: ev.target.text.value,
                        title: ev.target.title.value,
                        date,
                    }
                    : a
            ),
        );
    }

    async function handleDeleteEvent(ev_id) {
        const { error } = await supabase.from("events").delete().eq("ev_id", ev_id);

        setEvents(events.filter((a) => a.ev_id != ev_id));
    }

    async function handleReserveEvent(ev_id, reserved) {
        if (!reserved) {
            const { data, error } = await supabase
                .from("event_reservations")
                .insert({
                    user_id: user.id,
                    ev_id,
                })
                .select()
                .single();

            setEvents(events.map((ev) =>
                    ev.ev_id == ev_id
                        ? { ...ev, event_reservations: [...ev.event_reservations, data] }
                        : ev
            ));
        } else {
            const { data, error } = await supabase
                .from("event_reservations")
                .delete()
                .eq("user_id", user.id);
            setEvents(events.map((ev) =>
                    ev.ev_id == ev_id
                        ? {
                            ...ev,
                            event_reservations: ev.event_reservations.filter(
                                (e) => e.user_id != user.id
                            ),
                        }
                        : ev
            ));
            if (error) console.log(error.message);
        }
        return {events, evCnt, page, setPage, handleAddEvent,  
            handleEditEvent, handleDeleteEvent, showModal,
            setShowModal, handleReserveEvent}
    }

    function Event({
        event,
        handleEditEvent,
        handleDeleteEvent,
        handleReserveEvent,
        isAdmin,
        userIdNameMap,
    }) {
        let [modalText, setModalText] = useState(null);
        let [showReserv, setShowReserv] = useState(false);
        let { user } = useContext(AppContext);
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

        let reserved = event.event_reservations?.find((e) => e.user_id == user.id);

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
                                onClick={() => handleReserveEvent(event.ev_id, reserved)}
                                className={`btn btn-sm ${reserved ? "btn-error" : "btn-primary"}`}
                            >
                                {reserved ? "Cancel RSVP" : "RSVP"}
                            </button>
                            {event.event_reservations?.length > 0 && (
                                <button
                                    onClick={() => setShowReserv(true)}
                                    className="bg-neutral rounded-full w-8 h-8 text-gray-100 flex items-center justify-center font-bold text-sm"
                                >
                                    {event.event_reservations?.length}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-xs font-bold">{event.author}</div>
                            {isAdmin && (
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
                            )}
                        </div>
                    </div>
                </div>
                <Modal show={showReserv} close={() => setShowReserv(false)}>
                    {showReserv && (
                        <div>
                            <div className="text-xl text-center font-bold">RSVPs</div>
                            <div className="grid grid-cols-4">
                                {event.event_reservations?.map((r) => (
                                    <div className="text-center">
                                        {userIdNameMap.get(r.user_id)}
                                    </div>
                                ))}
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
}