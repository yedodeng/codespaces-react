import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "./App";

export default function Profile() {
    let { user_id } = useParams();
    let { user } = useContext(AppContext);

    return (
        <div>
            <div>
                Welcome {user.full_name}
            </div>
        </div>
    )
}