import ClubList from "../components/club-list";

export default function AllClubsPage() {
  return (
    <div>
      <h1>All Clubs</h1>
      <ClubList myClubsOnly={false} />
    </div>
  );
}
