import { useParams, } from "react-router-dom"
import Calendar from "../../components/calendar";

export default function ClubCalendar() {
  let { club_id } = useParams();
  return (<div>
    <Calendar isClub={true} club_id={club_id} />
  </div>);
}