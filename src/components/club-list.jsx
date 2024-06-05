import { Link } from "react-router-dom";
import useClubs from "../hooks/useClubs";

export default function ClubList({ myClubsOnly }) {
  let { clubs, page, setPage, numPages } = useClubs({ myClubsOnly });

  return (
    <div>
      <div>
        {clubs.map((v) => (
          <div
            className="flex flex-col border-2 p-2 border-secondary w-1/3 mb-4"
            key={v.club_id}
          >
            <Link to={`/club/${v.club_id}`} className="text-xl mb-2">
              {v.name}
            </Link>
            {/* <div className="text-sm text-gray-500">Created at {v.created_at}</div> */}

            <div className="flex">
              <button
                disabled={v.club_memberships?.length > 0}
                className="btn btn-xs btn-success mr-4"
                onClick={() => handleJoinClub(v.club_id)}
              >
                Join
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-x-5">
          {new Array(numPages).fill(0).map((v, i) => (
            <div
              key={i}
              className="border-r px-5 cursor-pointer hover:bg-purple-500"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
