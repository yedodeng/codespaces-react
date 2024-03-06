import { useEffect } from "react";
import { useParams } from "react-router-dom"

export default function Club() {

    let {club_id} = useParams();

    useEffect(() =>  {
        if (club_id) {
            handleLoadClub();
        }
    }, [club_id])

    async function handleLoadClub() {
        
    }

    return (
        <div>Hello World</div>
    )
}