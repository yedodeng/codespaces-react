import useMembers from "./useMembers";

export default function useUserIdNameMap({club_id}) {
    let {members} = useMembers({club_id});

    let userIdNameMap = new Map();

    for (let i = 0; i < members.length; i++) {
        userIdNameMap.set(
            members[i].user_id,
            members[i].profiles.full_name
        );
    }

    return userIdNameMap;
}