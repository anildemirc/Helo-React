import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./Post.scss";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { PostWithAuth, refreshToken } from '../../services/HttpService';
import { useNavigate } from "react-router-dom";


function PostForm(props) {
    const {userId, username, refreshPosts} = props;
    const [text, setText] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [isSent, setIsSent] = React.useState(false);
    let navigate = useNavigate();

    const savePost = () => {
        PostWithAuth("/posts",{title:title,userId:userId,text:text})
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
                    savePost();
                }
                })
                .catch((err) => {
                console.log("err", err);
                })
            }
        })
        .then((result) => {
            console.log("savePost result",result);
            refreshPosts()
        })
        .catch(err => console.log("err", err)) 
    }

    const handleSubmit = () => {
        snackBarOpen();
        savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        
    };

    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }

    const snackBarOpen = () => {
        setIsSent(true);
      };

    const snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsSent(false);
      };

    return(
        <div>
            <Snackbar open={isSent} autoHideDuration={6000} onClose={snackBarClose}>
                <Alert
                onClose={snackBarClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
                >
                Formunuz başarılı şekilde gönderildi.
                </Alert>
            </Snackbar>
             <Card sx={{ width: 800, margin: 2}} >
                <CardHeader
                    avatar={
                    <Link to={{pathname : '/users/' + userId}} className='link'>
                        <Avatar className='bgColor'>
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                    }
                    title= {<OutlinedInput 
                        id='outlined-adornment-amont'
                        multiline
                        placeholder='Title'
                        inputProps={{maxLength : 25}}
                        fullWidth
                        value = {title}
                        onChange={(i) => handleTitle(i.target.value)} 
                    />}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                    {<OutlinedInput 
                        id='outlined-adornment-amont'
                        multiline
                        placeholder='Text'
                        inputProps={{maxLength : 255}}
                        fullWidth
                        value = {text}
                        onChange={(i) => handleText(i.target.value)} 
                    />}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button variant='contained' onClick={handleSubmit}>Post</Button>
                </CardActions>
                </Card>
        </div>
    );


}

export default PostForm;