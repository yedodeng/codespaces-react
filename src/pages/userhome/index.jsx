import ClubList from "../../components/club-list";

export default function UserHome() {
  return (
    <div>
      <div className="font-bold text-3xl text-center mb-4">My Clubs</div>
      <ClubList myClubsOnly={true} />
    </div>
  );
}

