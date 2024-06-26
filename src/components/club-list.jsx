import { Link } from "react-router-dom";
import useClubs from "../hooks/useClubs";
import PageBtns from "./pagebtns";

export default function ClubList({ myClubsOnly }) {
  let { clubs, page, setPage, page_size, clubCnt } = useClubs({ myClubsOnly });

  return (
    <>
      <div className = "flex flex-col items-center">
        {clubs.filter(
              (_, i) =>
                page * page_size <= i && i <= page * page_size + page_size - 1
            ).map((v) => (
          <div
            className="flex flex-col border-2 p-2 border-secondary w-2/3 mb-4"
            key={v.club_id}
          >
            <Link to={`/club/${v.club_id}`} className="text-2xl mb-2">
              {v.name}
            </Link>

            {!myClubsOnly && <div className="flex">
              <button
                disabled={v.club_memberships?.length > 0}
                className="btn btn-xs btn-success mr-4"
                onClick={() => handleJoinClub(v.club_id)}
              >
                Join
              </button>
            </div> }
          </div>
        ))}
      </div>
      <PageBtns cnt={clubCnt} page = {page} setPage={setPage} page_size={page_size}></PageBtns>
      </>
  );
}
