import ClubList from "../../../components/club-list";

export default function Admin() {
  return (
    <div>
      <div className="font-bold text-3xl text-center mb-4">Admin</div>
      <ClubList myClubsOnly={false} admin={true} />
    </div>
  );
}

