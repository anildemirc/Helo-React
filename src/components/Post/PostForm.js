import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./Post.scss";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function PostForm(props) {
    const {userId, username, refreshPosts} = props;
    const [text, setText] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [isSent, setIsSent] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const savePost = () => {
        fetch("/posts", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                title:title,
                userId:userId,
                text:text,
            }),
        })
        .then((res) => res.json())
        .catch((err) => console.log("error"))
    }

    const handleSubmit = () => {
        snackBarOpen();
        savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts();
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
        setOpen(true);
      };

    const snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return(
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={snackBarClose}>
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