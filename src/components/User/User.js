import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import { GetWithAuth } from "../../services/HttpService";

function User() {
    const { userId} = useParams();
    const [user, setUser] = useState();

    const getUser = () => {
        GetWithAuth("/users/"+ userId)
        .then(res => res.json())
        .then(
            (result) => {
                console.log("result getUser() ", result);
                setUser(result);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {  
        getUser();
    },[]);

    return(
        <div style= {{display:'flex'}}>
            {user? <Avatar avatarId = {user.avatarId} userId= {userId} username= {user.username} countFollowed={user.countFollowed} /> : ""}
            <UserActivity userId={userId}></UserActivity>
        </div>
    );
}

export default User;