import { Link } from "react-router-dom";
import useClubs from "../hooks/useClubs";
import PageBtns from "./pagebtns";
import Modal from "./modal";

export default function ClubList({ myClubsOnly, admin }) {
  let { clubs, page, setPage, page_size, clubCnt, showModal, setShowModal,
    handleJoinClub, handleDeleteClub, handleCreateClub } = useClubs({ myClubsOnly });

  return (
    <>
      <div className="flex flex-col items-center">
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
            {!myClubsOnly && !admin && <div className="flex">
              <Link
                disabled={v.club_memberships?.length > 0}
                className="btn btn-xs btn-success mr-4"
                onClick={() => handleJoinClub(v.club_id)}
                to={`/club/${v.club_id}`}
              >
                Join
              </Link>
            </div>}
            {admin && (
              <div>
                <button
                  className="btn btn-xs bg-red-400"
                  onClick={() => handleDeleteClub(v.club_id)}
                >
                  {" "}
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <PageBtns cnt={clubCnt} page={page} setPage={setPage} page_size={page_size}></PageBtns>
      {admin && <button
        className="btn font-bold text-xl my-4 btn-primary"
        onClick={() => setShowModal(true)}
      >
        Create New Club
      </button> }
      <Modal show={showModal} close={() => setShowModal(false)} btn="Cancel">
        {showModal && (
          <form
            className="w-full flex flex-col space-y-3"
            onSubmit={handleCreateClub}
          >
            <div className="font-bold text-center text-xl">
              Create New Club
            </div>
            <textarea
              className="textarea textarea-primary"
              name="name"
            ></textarea>
            <div className="flex justify-center">
              <button className="btn btn-sm font-bold w-1/3 btn-primary">Submit</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
