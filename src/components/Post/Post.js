import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import "./Post.scss";
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { DeleteWithAuth, PostWithAuth } from '../../services/HttpService';

function Post(props) {
    const {title, text, userId, username, createTime, postId, postLikes} = props;
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [commentList, setCommentList] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [isLiked, setIsLiked] = React.useState(false)
    const isInitialMount = React.useRef(true);
    const [likeCount, setLikeCount] = React.useState(postLikes.length);
    const [likeId, setLikeId] = React.useState(null);
    let disabled = localStorage.getItem("currentUser") == null ? true : false;

    
    const checkLikes = () => {
        var likeControl = postLikes.find(like => ""+like.userId === localStorage.getItem("currentUser"));
        if(likeControl != null) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };

    const saveLike = () => {
        PostWithAuth("/likes",{postId:postId, userId:localStorage.getItem("currentUser")})
        .then((res) => res.json())
        .then(
            (result) => {
                setLikeId(result.id);
            }
        )
        .catch((err) => console.log("error"))
    }
    
    const deleteLike = () => {
        DeleteWithAuth("/likes/"+likeId)
        .then((res) => res.json())
        .catch((err) => console.log("error"))
    }

    const refreshComments = () => {
        fetch("/comments?postId="+postId)
        .then(res => res.json())
        .then(
            (result) => {
                console.log("result ", result);
                setIsLoaded(true);
                setCommentList(result);
                isInitialMount.current = true;
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    React.useEffect(() => {
        checkLikes()
    },[]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        if(isLiked){
            deleteLike();
            setLikeCount(likeCount-1)
        }
        else{
            saveLike();
            setLikeCount(likeCount+1)
        }
    };

    return(
        <div >
             <Card sx={{ width: 800, margin: 2}} >
                <CardHeader
                    avatar={
                    <Link to={{pathname : '/users/' + userId}} className='link'>
                        <Avatar className='bgColor' aria-label="recipe">
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                    }
                    title={title}
                    subheader={createTime}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                    {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {disabled ? <IconButton 
                    disabled
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon className={isLiked? "clr-red": ""}/>
                    </IconButton>: 
                    <IconButton 
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon className={isLiked? "clr-red": ""}/>
                    </IconButton> }
                    
                    {likeCount}
                    <IconButton
                    expand={expanded}
                    onClick={handleExpandClick}
                    >
                    <CommentIcon className="ml-auto"/>
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed className=''>
                        {disabled ? "" : <CommentForm userId = {localStorage.getItem("currentUser")} username = {localStorage.getItem("username")} postId = {postId} refreshComments={refreshComments}></CommentForm>}
                        {error? "error" : isLoaded ? commentList.length >0 ? commentList.map(comment => (
                            <Comment userId = {comment.userId} username = {comment.username} text= {comment.text}></Comment>
                        )):null : "Loading"}
                        
                    </Container>
                </Collapse>
                </Card>
        </div>
    );


}

export default Post;