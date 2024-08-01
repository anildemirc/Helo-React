import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import AvatarList from "../Avatar/AvatarList";
import { GetWithoutAuth, GetWithAuth, refreshToken } from '../../services/HttpService';
import { useNavigate } from "react-router-dom";


function Following() {
    let navigate = useNavigate();

    const {userId} = useParams();
    const [user, setUser] = useState();
    const [followingList, setFollowingList] = useState([]);

    const getUser = () => {
        GetWithoutAuth("/users/"+ userId)
        .then((res) => res.json())
        .then((result) => {
            setUser(result);
        })  
    }

    const getmyfolloweds = () => {
        GetWithAuth("/follow/getmyfolloweds/"+userId)
        .then((res) => {
            if(res.ok) {
              return res.json();
            }
            else {
              refreshToken()
              .then((res) => {
                if(res.ok) {
                  return res.json();
                }
                else {
                  localStorage.removeItem("tokenKey");
                  localStorage.removeItem("currentUser");
                  localStorage.removeItem("username");
                  localStorage.removeItem("refreshKey");
                  navigate(0);
                  return;
                }
              })
              .then((result) => {
                if(result != undefined) {
                  localStorage.setItem("tokenKey", result.accessToken);
                  getmyfolloweds(userId);
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
          .then((result) => {
            setFollowingList(result);
          })
      }


    useEffect(() => {  
        getUser();
    },[]);

    useEffect(() => {  
        getmyfolloweds();
    },[]);

    return (
        <div style= {{display:'flex'}}>
            {user? <Avatar avatarId = {user.avatarId} userId= {userId} username= {user.username} countFollowed={user.countFollowed} countFollower={user.countFollower} /> : ""}
            <AvatarList followingList={followingList} />
        </div>
    );
}

export default Following;