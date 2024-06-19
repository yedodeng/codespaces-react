import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import Modal from "../../components/modal";
import useAnns from "../../hooks/useAnns";
import useEvents from "../../hooks/useEvents";
import Announcement from "../../components/announcement";

const page_size = 3;

export default function Club() {
  let { user } = useContext(AppContext);
  let { club_id } = useParams();
  let [club, setClub] = useState(undefined);
  let { pathname } = useLocation();
  const page_size = 3;

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
      <div>
          {role === "Admin" && (
            <Link to={`${pathname}/admin`}>
              <button className="btn btn-error text-lg">Admin</button>
            </Link>
          )}
        </div>
        <div className="text-center text-3xl font-bold">
          {club ? club.name : ""}
        </div>
        <div className="px-5 text-sm my-2">{club.description}</div>
        <div className="text-center text-2xl font-bold p-3">Members</div>
        <Members club={club} role={role} reload={handleLoadClub} />
        {role != "Pending" ? (
          <div className="my-4">
            <Announcements club_id={club_id} />
            <Events
              club_id={club_id}
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


function Members({ club }) {
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
              .filter((m) => m.role != "Pending")
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
                    {mem.role}
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </div>
  );
}

function Announcements({ club_id }) {
  let { anns, annCnt, page, setPage }
    = useAnns({ club_id, page_size });

  return (
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
              isAdmin={false}
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
      </div>
    </div>
  );
}

function Events({ club_id, userIdNameMap }) {
  let {events, evCnt, page, setPage, handleReserveEvent} = useEvents({club_id, page_size});

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
                userIdNameMap={userIdNameMap}
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
        </div>
      </div>
    </>
  );
}

function Event({
  event,
  handleReserveEvent,
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
              onClick={() => handleReserveEvent(event.ev_id, reserved, user.id)}
              className={`btn btn-sm ${reserved ? "btn-error" : "btn-primary"}`}
            >
              {reserved ? "Cancel RSVP" : "RSVP"}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs font-bold">{event.author}</div>
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
    </>
  );
}
