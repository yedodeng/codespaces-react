import { getDaysInMonth, getMonth, getYear } from "date-fns";
import useCalendar from "../hooks/useCalendar";
import { Link } from "react-router-dom";

export default function Calendar({ isClub = false, club_id = null }) {
  let { events, anns, name, now, setNow, next, prev, chk, first } = useCalendar({ isClub, club_id });
  const sevenh = { width: (100 / 7).toString() + "%", textAlign: "center" };
  let month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  return (
    <>
      {isClub &&
        <Link to={`/club/${club_id}`}>
          <button className="btn btn-error text-lg">Done</button>
        </Link>}
      <div className="flex justify-center mb-4 font-bold text-3xl">{name} Calendar </div>
      <div className="flex justify-center mb-4 font-bold text-2xl">
        {month[getMonth(now)] + " "}{getYear(now)}
      </div>
      <div className="flex justify-center space-x-2">
        <button onClick={() => prev()} className="btn btn-sm pb-2 text-lg">
          {"<"}
        </button>
        <button onClick={() => setNow(new Date())} className="btn btn-sm">
          Today
        </button>
        <button onClick={() => next()} className="btn btn-sm pb-2 text-lg">
          {">"}
        </button>
      </div>
      <div style={{ justifyContent: "center" }}>
        <div className="flex mt-5">
          <div style={sevenh}>Sun</div>
          <div style={sevenh}>Mon</div>
          <div style={sevenh}>Tue</div>
          <div style={sevenh}>Wed</div>
          <div style={sevenh}>Thu</div>
          <div style={sevenh}>Fri</div>
          <div style={sevenh}>Sat</div>
        </div>
        <div className="flex flex-wrap mt-4">
          {new Array(first.getDay()).fill(0).map((v, i) => (
            <div
              style={{
                width: (100 / 7).toString() + "%",
                height: 150,
                boxSizing: "border-box",
              }}
              key={i}
              className="text-center"
            ></div>
          ))}
          {new Array(getDaysInMonth(now)).fill(0).map((v, i) => (
            <div
              style={{
                width: (100 / 7).toString() + "%",
                height: 150,
                boxSizing: "border-box",
                backgroundColor: "white"
              }}
              key={i}
              onClick={() => filterByDate(i + 1)}
              className="text-center"
            >
              <div style={{ height: 20 }} className="mx-1 font-bold text-center">{i + 1}</div>
              <div style={{ height: 120, marginTop: 10 }} className="mx-1 space-y-1 overflow-auto">

                {isClub ? events.filter((ev) => chk(i, ev.date)).map((ev, i) =>
                  <div key={i} className="text-xs p-1 bg-red-100 rounded-md truncate">{ev.title}</div>
                ) : events.map((clb) => clb.events.filter((ev) => chk(i + 1, ev.date)).map((ev, i) =>
                  <div key={i} className="text-xs p-1 bg-red-100 rounded-md truncate">{clb.name}: {ev.title}</div>
                ))}
                {isClub ? anns.filter((ann) => chk(i, ann.created_at)).map((ann, i) =>
                  <div key={i} className="text-xs p-1 bg-green-100 rounded-md truncate">{ann.text}</div>
                ) : anns.map((clb) => clb.announcements.filter((ann) => chk(i + 1, ann.created_at)).map((ann, i) =>
                  <div key={i} className="text-xs p-1 bg-green-100 rounded-md truncate">{clb.name}: {ann.text}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}