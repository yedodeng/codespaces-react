import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import Modal from "../../components/modal";

const page_size = 3;

export default function Club() {
  let { user } = useContext(AppContext);
  let { club_id } = useParams();
  let [club, setClub] = useState(undefined);
  let {pathname} = useLocation();

  useEffect(() => {
    if (club_id) {
      handleLoadClub();
    }
  }, []);

  const userIdNameMap = useMemo(() => {
    let m = new Map();

    for (let i = 0; i < club?.club_memberships.length; i++) {
      m.set(
        club.club_memberships[i].user_id,
        club.club_memberships[i].profiles.full_name
      );
    }

    return m;
  }, [club]);

  let role = club?.club_memberships.find((mem) => mem.user_id == user.id)?.role;

  async function handleLoadClub() {
    const { data, error } = await supabase
      .from("clubs")
      .select(
        "*, club_memberships(role, user_id, profiles(full_name, grad_year)), announcements(*), events(*, event_reservations(*))"
      )
      .single()
      .eq("club_id", club_id)
      .order("created_at", { foreignTable: "announcements", ascending: false })
      .range(0, page_size - 1, { foreignTable: "announcements" })
      .order("date", { foreignTable: "events", ascending: true })
      .range(0, page_size - 1, { foreignTable: "events" });

    if (error) alert(club_id);
    setClub(data);
  }

  if (typeof club == "undefined") return <div>Loading...</div>;

  return (
    <>
      <div>
        <div className="text-center text-3xl font-bold">
          {club ? club.name : ""}
        </div>
        <div>
          {role === "Admin" ? (
            <Link to={`${pathname}/admin`}>
              <button className="btn">admin</button>
            </Link>
          ) : (
            "m"
          )}
        </div>
        <Description club={club} isAdmin={role == "Admin"} />
        <div className="text-center text-2xl font-bold p-3">Members</div>
        <Members club={club} role={role} reload={handleLoadClub} />
        {role != "Pending" ? (
          <div className="my-4">
            <Announcements
              isAdmin={role == "Admin"}
              club={club}
              setClub={setClub}
            />
            <Events
              isAdmin={role == "Admin"}
              club={club}
              setClub={setClub}
              userIdNameMap={userIdNameMap}
            />
          </div>
        ) : (
          <div className="bold text-xl text-center my-4">
            Your application is currently pending
          </div>
        )}
      </div>
    </>
  );
}

function Description({ club, isAdmin }) {
  let [editDesc, setEditDesc] = useState(false);
  let [newDesc, setNewDesc] = useState(club.description);
  let [oldDesc, setOldDesc] = useState(club.description);
  async function handleUpdateDesc(description) {
    const { data, error } = await supabase
      .from("clubs")
      .update({ description: newDesc })
      .eq("club_id", club.club_id);
    setOldDesc(newDesc);
  }

  return (
    <div className="px-5 text-sm">
      {!editDesc && <div className="my-2">{newDesc}</div>}
      {editDesc && (
        <textarea
          className="textarea textarea-bordered w-full my-2"
          value={newDesc}
          onChange={(ev) => setNewDesc(ev.target.value)}
        ></textarea>
      )}
      {isAdmin && (
        <div className="flex justify-end">
          {!editDesc ? (
            <button
              onClick={() => setEditDesc(true)}
              className="btn btn-sm btn-warning"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditDesc(false);
                  handleUpdateDesc();
                }}
                className="btn btn-sm btn-success mx-4"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditDesc(false);
                  setNewDesc(oldDesc);
                }}
                className="btn btn-sm btn-error"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Members({ club, role, reload }) {
  async function handleUpdateRole(user_id, role) {
    const { error } = await supabase
      .from("club_memberships")
      .update({ role })
      .eq("club_id", club.club_id)
      .eq("user_id", user_id);
    console.log("yes");
    reload();
  }

  async function handleDelete(user_id) {
    const { error } = await supabase
      .from("club_memberships")
      .delete()
      .eq("user_id", user_id);
    reload();
  }

  return (
    <div className="overflow-x-auto bg-base-100 rounded">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Graduation Year</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {club
            ? club.club_memberships
                .filter((m) => m.role != "Pending" || role == "Admin")
                .map((mem, i) => (
                  <tr key={mem.user_id}>
                    <th>{i + 1}</th>
                    <td>
                      <Link to={`/profile/${mem.user_id}`}>
                        {mem.profiles.full_name}
                      </Link>
                    </td>
                    <td>{mem.profiles.grad_year}</td>
                    <td>
                      {role == "Admin" ? (
                        mem.role == "Pending" ? (
                          <div className="flex items-center space-x-4">
                            <div>Pending</div>
                            <button
                              className="btn btn-xs btn-success mr-4"
                              onClick={() =>
                                handleUpdateRole(mem.user_id, "Member")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => handleDelete(mem.user_id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : mem.role == "Member" ? (
                          <div className="flex items-center space-x-4">
                            <select
                              className="select select-primary select-xs"
                              defaultValue={mem.role}
                              onChange={(ev) =>
                                handleUpdateRole(mem.user_id, ev.target.value)
                              }
                            >
                              <option value="Member">Member</option>
                              <option value="Admin">Admin</option>
                            </select>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => handleDelete(mem.user_id)}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <select
                            className="select select-primary select-xs"
                            defaultValue={mem.role}
                            onChange={(ev) =>
                              handleUpdateRole(mem.user_id, ev.target.value)
                            }
                          >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                          </select>
                        )
                      ) : (
                        mem.role
                      )}
                    </td>
                  </tr>
                ))
            : ""}
        </tbody>
      </table>
    </div>
  );
}

function Announcements({ isAdmin, club, setClub }) {
  let [showModal, setShowModal] = useState(false);
  let [page, setPage] = useState(0);
  let [annCnt, setAnnCnt] = useState(0);
  let { user } = useContext(AppContext);

  useEffect(() => {
    handleLoadAnnouncementCnt();
  }, [club]);

  useEffect(() => {
    handleLoadAnnouncements();
  }, [page]);

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

    setClub({ ...club, announcements: [...club.announcements, ...data] });
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

    setClub({ ...club, announcements: [...club.announcements, data] });
    setShowModal(false);
  }

  async function handleEditAnnouncement(ev, close, ann_id) {
    ev.preventDefault();

    const { error } = await supabase
      .from("announcements")
      .update({ text: ev.target.text.value })
      .eq("ann_id", ann_id);

    console.log(error);
    setClub({
      ...club,
      announcements: club.announcements.map((a) =>
        a.ann_id == ann_id ? { ...a, text: ev.target.text.value } : a
      ),
    });
    close();
  }

  async function handleDeleteAnnouncement(ann_id) {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("ann_id", ann_id);

    setClub({
      ...club,
      announcements: club.announcements.filter((a) => a.ann_id != ann_id),
    });
  }

  return (
    <>
      <div>
        <div className="text-center text-2xl font-bold p-3">Announcements</div>
        <div className="space-y-3">
          {club.announcements
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

function Events({ isAdmin, club, setClub, userIdNameMap }) {
  let [showModal, setShowModal] = useState(false);
  let [page, setPage] = useState(0);
  let [evCnt, setEvCnt] = useState(0);
  let { user } = useContext(AppContext);

  useEffect(() => {
    handleLoadEvCnt();
  }, [club]);

  useEffect(() => {
    handleLoadEvents();
  }, [page]);

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

    setClub({ ...club, events: [...club.events, ...data] });
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

    setClub({ ...club, events: [...club.events, data] });
    setShowModal(false);
  }

  async function handleEditEvent(ev, close, ev_id) {
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

    console.log(error);
    setClub({
      ...club,
      events: club.events.map((a) =>
        a.ev_id == ev_id
          ? {
              ...a,
              text: ev.target.text.value,
              title: ev.target.title.value,
              date,
            }
          : a
      ),
    });
    close();
  }

  async function handleDeleteEvent(ev_id) {
    const { error } = await supabase.from("events").delete().eq("ev_id", ev_id);

    setClub({
      ...club,
      events: club.events.filter((a) => a.ev_id != ev_id),
    });
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

      setClub({
        ...club,
        events: club.events.map((ev) =>
          ev.ev_id == ev_id
            ? { ...ev, event_reservations: [...ev.event_reservations, data] }
            : ev
        ),
      });
    } else {
      const { data, error } = await supabase
        .from("event_reservations")
        .delete()
        .eq("user_id", user.id);

      setClub({
        ...club,
        events: club.events.map((ev) =>
          ev.ev_id == ev_id
            ? {
                ...ev,
                event_reservations: ev.event_reservations.filter(
                  (e) => e.user_id != user.id
                ),
              }
            : ev
        ),
      });

      if (error) console.log(error.message);
    }
  }

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
