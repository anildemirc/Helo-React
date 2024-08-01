import React, {useState, useEffect} from "react";
import Post from "../Post/Post";
import "./Home.scss";
import PostForm from "../Post/PostForm";
import { GetWithoutAuth, refreshToken } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function Home() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    let navigate = useNavigate();

    const refreshPosts = () => {
        GetWithoutAuth("/posts")
        .then((res) => res.json())
        .then((result) => {
            if(result === -1) {
                setIsLoaded(true);
                setError(error);
            }
            else {
                setIsLoaded(true);
                setPostList(result);
            }
        });
        
        
    }

    useEffect(() => {
        refreshPosts();
    },[]);

    if(error) {
        return <div> Error :( !!!</div>
    }
    else if(!isLoaded) {
        return <div> Loading... </div>
    }
    else {
        return(
            <div className="container">
                
                {localStorage.getItem("currentUser") == null ?"":
                <PostForm userId={localStorage.getItem("currentUser")} username={localStorage.getItem("username")} 
                createTime={0} refreshPosts = {refreshPosts}></PostForm>}

                {(postList != undefined && postList.length > 0) ? postList.map(post => (
                    <Post userId={post.userId} username={post.username}
                     createTime={post.createTime} title={post.title} 
                     text={post.text} postId={post.id} postLikes={post.postLikes} followerCount={post.userFollowerCount} followedCount={post.userFollowedCount}></Post>
                )): ""}
            </div>
        );
    }

}

export default Home;