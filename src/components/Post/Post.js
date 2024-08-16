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
import { Button, Container } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { DeleteWithAuth, GetWithoutAuth, PostWithAuth, refreshToken } from '../../services/HttpService';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import User from '../User/User';
import AvatarCard from '../Avatar/AvatarCard';

function Post(props) {
    const {title, text, userId, username, createTime, postId, postLikes, userInfo, followerCount, followedCount} = props;
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [commentList, setCommentList] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [isLiked, setIsLiked] = React.useState(false)
    const isInitialMount = React.useRef(true);
    const [likeCount, setLikeCount] = React.useState(postLikes != undefined ? postLikes.length : 0);
    const [likeId, setLikeId] = React.useState(null);
    let disabled = localStorage.getItem("currentUser") == null ? true : false;
    const [popupIsOpen, setPopupIsOpen] = React.useState(false);
    let navigate = useNavigate();
    
    const checkLikes = () => {
        if (likeCount == undefined || likeCount == 0) {
          setIsLiked(false);
        }
        else {
          var likeControl = postLikes.find(like => ""+like.userId === localStorage.getItem("currentUser"));
          if(likeControl != null) {
              setLikeId(likeControl.id);
              setIsLiked(true);
          }
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };

    const saveLike = () => {
        PostWithAuth("/likes",{postId:postId, userId:localStorage.getItem("currentUser")})
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
                  saveLike();
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
          .then((result) => {
            console.log("saveLikeResult", result)
            setLikeId(result.id);
          })
          .catch(err => console.log("err", err))
    }
    
    const deleteLike = () => {
        DeleteWithAuth("/likes/"+likeId)
        .then((res) => {
            if(res.ok) {
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
                  localStorage.removeItem("tokenKey");
                  localStorage.setItem("tokenKey", result.accessToken);
                  deleteLike();
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
    }

    const refreshComments = () => {
        GetWithoutAuth("/comments?postId="+postId)
        .then((res) => res.json())
        .then((result) => {
            if(result === -1) {
                setIsLoaded(true);
                setError(error);
            }
            else {
                setIsLoaded(true);
                setCommentList(result);
                isInitialMount.current = true;
            }
        })
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

    const HtmlTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 300,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }));

    return(
        <div >
             <Card sx={{ width: 800, margin: 2, maxWidth: 800}} >
                  <CardHeader
                  sx={{width: 600, maxWidth: 600}}
                        avatar={
                          <HtmlTooltip placement="right-start"
                            title={
                              <React.Fragment>
                                <AvatarCard userId={userId} username={username} userInfo={"User Info"} followerCount={followerCount} followedCount={followedCount}/>
                              </React.Fragment>
                            }
                          >
                            <Link to={{pathname : '/users/' + userId}} className='link'>
                            <Avatar className='bgColor' aria-label="recipe">
                                {username.charAt(0).toUpperCase()}
                            </Avatar>
                            </Link>
                          </HtmlTooltip>
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