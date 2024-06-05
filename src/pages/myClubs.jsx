import ClubList from "../components/club-list";

export default function MyClubsPage() {
  return (
    <div>
      <h1>My Clubs</h1>
      <ClubList myClubsOnly={true} />
    </div>
  );
}
