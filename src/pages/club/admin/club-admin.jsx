import { useNavigate, useParams } from "react-router-dom";
import ManageDesc from "./manage-desc";
import ManageTitle from "./manage-name";
import ManageMembers from "./manage-members";
import ManageAnns from "./manage-anns";
import ManageEvents from "./manage-events";

export default function ClubAdmin() {
  let { club_id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button className="btn btn-error text-lg" onClick={() => navigate(`/club/${club_id}`)}>Done</button>
      <ManageTitle club_id={club_id} />
      <div className = "my-4"></div>
      <ManageDesc club_id={club_id} />
      <div className = "my-4"></div>
      <ManageMembers club_id={club_id} />
      <div className = "my-4"></div>
      <ManageAnns club_id={club_id}></ManageAnns>
      <div className = "my-4"></div>
      <ManageEvents club_id={club_id}></ManageEvents>
    </div>
  );
}

