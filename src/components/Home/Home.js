import React, {useState, useEffect} from "react";
import Post from "../Post/Post";
import "./Home.scss";
import PostForm from "../Post/PostForm";

function Home() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("/posts")
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
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
                <PostForm userId={2} username={"anil"} 
                createTime={0} refreshPosts = {refreshPosts}>
                    
                </PostForm>
                {postList.map(post => (
                    <Post userId={post.userId} username={post.username}
                     createTime={post.createTime} title={post.title} 
                     text={post.text} postId={post.id}></Post>
                ))}
            </div>
        );
    }

}

export default Home;