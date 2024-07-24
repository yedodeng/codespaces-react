import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useAnns from "../../hooks/useAnns";
import useEvents from "../../hooks/useEvents";
import Announcement from "../../components/announcement";
import Event from "../../components/event";
import PageBtns from "../../components/pagebtns";
import useClub from "../../hooks/useClub";

const page_size = 3;

export default function Club() {
  let { club_id } = useParams();
  let { pathname } = useLocation();
  let { club, role, handleLeaveClub } = useClub({ club_id });
  return (
    <>
      <div className="flex justify-between">
        {role == "Admin" && (
          <Link to={`${pathname}/admin`}>
            <button className="btn btn-error text-lg">Admin</button>
          </Link>
        )}
        {role != "Pending" && (
        <Link to={`${pathname}/calendar`}>
          <button className="btn btn-primary text-lg">Calendar</button>
        </Link>
        )}
      </div>
      <div className="text-center text-3xl font-bold">
        {club?.name}
      </div>
      <div className="px-5 text-sm mt-2">{club?.description}</div>
      <div className="text-center text-2xl font-bold p-3">Members</div>
      <Members club={club} role={role} />
      {role != "Pending" ? (
        <div className="space-y-4 mt-4">
          <div className="text-center text-2xl font-bold p-3">Announcements</div>
          <Announcements club_id={club_id} />
          <div className="text-center text-2xl font-bold p-3">Events</div>
          <Events club_id={club_id} />
          <div className="flex justify-end">
            <button className="btn btn-error text-lg" onClick={() => handleLeaveClub()}>Leave Club</button>
          </div>
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
    <>
      {club?.club_memberships.filter((m) => m.role != "Pending").length > 0 ?
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
        </div> :
        <div className="text-center text-xl ">No Members</div>}
    </>
  );
}

function Announcements({ club_id }) {
  let { anns, annCnt, page, setPage } = useAnns({ club_id, page_size });

  return (
    <>
      {anns?.length > 0 ?
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
          <PageBtns cnt={annCnt} page={page} setPage={setPage} page_size={page_size}></PageBtns>
        </div> : <div className="text-center text-xl">No Announcements</div>}
    </>
  );
}

function Events({ club_id }) {
  let { events, evCnt, page, setPage, handleReserveEvent } = useEvents({ club_id, page_size });
  return (
    <>
      {events?.length > 0 ?
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
        </div> : <div className="text-center text-xl">No Events</div>}
    </>
  );
}

