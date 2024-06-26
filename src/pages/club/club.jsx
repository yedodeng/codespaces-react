import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import useAnns from "../../hooks/useAnns";
import useEvents from "../../hooks/useEvents";
import Announcement from "../../components/announcement";
import Event from "../../components/event";
import PageBtns from "../../components/pagebtns";

const page_size = 3;

export default function Club() {
  let { user } = useContext(AppContext);
  let { club_id } = useParams();
  let [club, setClub] = useState(undefined);
  let { pathname } = useLocation();

  useEffect(() => {
    if (club_id) {
      handleLoadClub();
    }
  }, []);

  let role = club?.club_memberships.find((mem) => mem.user_id == user.id)?.role;

  async function handleLoadClub() {
    const { data, error } = await supabase
      .from("clubs")
      .select(
        "*, club_memberships(role, user_id, profiles(full_name, grad_year))"
      )
      .single()
      .eq("club_id", club_id)

    if (error) alert(club_id);
    setClub(data);
  }

  if (typeof club == "undefined") return <div>Loading...</div>;

  return (
    <>
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
        <div className="px-5 text-sm mt-2">{club.description}</div>
        <div className="text-center text-2xl font-bold p-3">Members</div>
        <Members club={club} role={role} reload={handleLoadClub} />
        {role != "Pending" ? (
          <div className="my-4">
            <div className="text-center text-2xl font-bold p-3">Announcements</div>
            <Announcements club_id={club_id} />
            <div className="text-center text-2xl font-bold p-3">Events</div>
            <Events club_id={club_id} />
          </div>
        ) : (
          <div className="bold text-xl text-center my-4">
            Your application is currently pending
          </div>
        )}
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
  let { anns, annCnt, page, setPage } = useAnns({ club_id, page_size });

  return (
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
        <PageBtns cnt={annCnt} page = {page} setPage={setPage} page_size={page_size}></PageBtns>
      </div>
  );
}

function Events({ club_id }) {
  let { events, evCnt, page, setPage, handleReserveEvent } = useEvents({ club_id, page_size });

  return (
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
              handleReserveEvent={handleReserveEvent}
              isAdmin={false}
            />
          ))}
        <PageBtns cnt={evCnt} setPage={setPage} page={page} page_size={page_size}></PageBtns>
      </div>
  );
}

