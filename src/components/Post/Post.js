import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CommentIcon from '@mui/icons-material/Comment';
import "./Post.scss";
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';
import Comment from '../Comment/Comment';


function Post(props) {
    const {title, text, userId, username, createTime, postId} = props;
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [commentList, setCommentList] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    let i = 0;
    const isInitialMount = React.useRef(true);


    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
    };

    const [liked, setLiked] = React.useState(false);

    const refreshComments = () => {
        fetch("/comments?postId="+postId)
        .then(res => res.json())
        .then(
            (result) => {
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

    /*React.useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false;
        else
            refreshComments();
    },[commentList]);*/

    const handleLike = () => {
        setLiked(!liked);
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
                    <IconButton 
                    onClick={handleLike}
                    aria-label="add to favorites"
                    >
                    <FavoriteIcon className={liked? "clr-red": ""}/>
                    </IconButton>
                    <IconButton
                    expand={expanded}
                    onClick={handleExpandClick}
                    >
                    <CommentIcon className="ml-auto"/>
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed className=''>
                        {error? "error" : isLoaded ? commentList.length >0 ? commentList.map(comment => (
                            <Comment userId = {1} username = {"USER"} text= {comment.text}></Comment>
                        )):null : "Loading"}
                    </Container>
                </Collapse>
                </Card>
        </div>
    );


}

export default Post;