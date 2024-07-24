import { useNavigate, useParams, } from "react-router-dom"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export default function Calendar() {
  let { club_id } = useParams();
  let [now, setNow] = useState(new Date());
  let first = new Date(now);
  const sevenh = { width: (100 / 7).toString() + "%", textAlign: "center" };
  first.setDate(1);
  let days = [31, now.getYear() % 4 === 0 ? (now.getYear() % 1000 === 0 ? 28 : 29) : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  let mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let [events, setEvents] = useState([]);
  let [anns, setAnns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    let {data} = await supabase
    .from("events")
    .select("*")
    .eq("club_id", club_id);

    let {data: data2 } = await supabase
    .from("announcements")
    .select("*")
    .eq("club_id", club_id);

    setEvents(data);
    setAnns(data2); 
  }

  function next() {
    let future = new Date(now);
    future.setMonth(future.getMonth() + 1);
    setNow(future);
  }

  function prev() {
    let future = new Date(now);
    future.setMonth(future.getMonth() - 1);
    setNow(future);
  }

  function chk(i, d) {
    let s = i > 9 ? mon[now.getMonth()] + " " + i + " " + now.getFullYear()
    : mon[now.getMonth()] + " 0" + i + " " + now.getFullYear();
    let da = new Date(d).toDateString().substring(4);
    return s == da;
  }


  return (
    <div>
      <div className="h-72 w-72 overflow-auto">
        {new Array(5).fill(0).map((v, i) => <div className="border h-24 w-full" key = {i}></div>)}
      </div>
      <button className="btn btn-error text-lg" onClick={() => navigate(`/club/${club_id}`)}>Done</button>
      <div className="flex justify-center mb-4">
        <strong className="text-4xl">
          {month[now.getMonth()] + " "}{now.getFullYear()}
        </strong>
      </div>
      <div className="flex justify-center space-x-2">
        <button onClick={() => { prev() }} className="btn btn-sm text-lg">
          {"<"}
        </button>
        <button onClick={() => setNow(new Date())} className="btn btn-sm">
          Today
        </button>
        <button onClick={() => { next() }} className="btn btn-sm text-lg">
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
                height: 140,
                boxSizing: "border-box",
              }}
              key={i}
              className="text-center"
            ></div>
          ))}
          {new Array(days[now.getMonth()]).fill(0).map((v, i) => (
            <div
              style={{
                width: (100 / 7).toString() + "%",
                height: 140,
                boxSizing: "border-box",
                backgroundColor: "white"
              }}
              key={i}
              onClick={() => filterByDate(i + 1)}
              className="text-center"
            >
              <div style={{height: 20}} className="bg-gray-100">{i + 1}</div>
              <div style={{height: 120}} className="space-y-1 overflow-auto">
                {events.filter((ev) => chk(i, ev.date)).map((ev, i) =>
                  <div className="text-xs p-1 bg-gray-100 rounded-md truncate">{ev.title}</div>
                )}
                {anns.filter((ann) => chk(i, ann.created_at)).map((ann, i) =>
                  <div className="text-xs p-1 bg-green-100 rounded-md truncate">{ann.text}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>{now.date}</div>
      </div>
    </div>
  );
}


