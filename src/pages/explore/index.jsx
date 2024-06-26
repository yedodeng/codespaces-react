import ClubList from "../../components/club-list";

export default function AllClubsPage() {
  return (
    <div>
      <div className="font-bold text-3xl text-center mb-4">All Clubs</div>
      <ClubList myClubsOnly={false} />
    </div>
  );
}
