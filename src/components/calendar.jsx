import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { supabase } from "../supabaseClient";

export default function Calendar({ isClub = false }) {
    let { user } = useContext(AppContext);
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
    let [name, setName] = useState("Full");

    useEffect(() => {
        if (isClub) handleLoad();
        else handleLoad2();
    }, []);

    async function handleLoad() {
        let { data } = await supabase
            .from("events")
            .select("*")
            .eq("club_id", club_id);

        let { data: data2 } = await supabase
            .from("announcements")
            .select("*")
            .eq("club_id", club_id);

        let { data: data3 } = await supabase
            .from("clubs")
            .select("name")
            .eq("club_id", club_id)
            .single();

        setEvents(data);
        setAnns(data2);
        setName(data3.name);
    }

    async function handleLoad2() {
        let { data: ids } = await supabase
            .from("club_memberships")
            .select("club_id")
            .eq("user_id", user.id)
        let ar = ids.map((id) => id.club_id);
        
        let { data } = await supabase
            .from("clubs")
            .select("name, events!inner(*)")
            .in("club_id", ar);

        let { data: data2 } = await supabase
            .from("announcements")
            .select("*")
            .in("club_id", ar);


        let ar2 = events.map((event, i) => [...event.events, event.name]);
        setEvents(data);
        setAnns(data2);
        console.log(events);
        console.log(ar2);
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
            {isClub &&
                <Link to={`/club/${club_id}`}>
                    <button className="btn btn-error text-lg">Done</button>
                </Link>}
            <div className="flex justify-center mb-4 font-bold text-3xl">{name} Calendar </div>
            <div className="flex justify-center mb-4 font-bold text-2xl">
                {month[now.getMonth()] + " "}{now.getFullYear()}
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
                    {new Array(days[now.getMonth()]).fill(0).map((v, i) => (
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
                                {events.map((event, i) => event.events.filter((ev) => chk(i, ev.created_at)).map((ev, i) => 
                                    <div key={i} className="text-xs p-1 bg-red-100 rounded-md truncate">{isClub? ev.title : ev.title }</div>
                                ))}
                                {anns.filter((ann) => chk(i, ann.created_at)).map((ann, i) =>
                                    <div key={i} className="text-xs p-1 bg-green-100 rounded-md truncate">{ann.text}</div>
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