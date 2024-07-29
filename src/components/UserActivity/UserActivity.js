import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Post from '../Post/Post';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { GetWithoutAuth, refreshToken } from '../../services/HttpService';
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function PopUp(props) {
    const {isOpen, postId, setIsOpen} = props;
    const [open, setOpen] = useState(false);
    const [post, setPost] = useState(null);
    let navigate = useNavigate();

    const getPost = () => {
        GetWithoutAuth("/posts/"+ postId)
        .then((res) => res.json())
        .then((result) => {
            setPost(result);
        })
        
    }

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect((() => {
        setOpen(isOpen);
    }),[isOpen]);

    useEffect((() => {
        getPost();
    }),[postId]);

    return(
        post != null ?
        <Dialog fullScreen open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => handleClose()} aria-label="close">
                <CloseIcon />
                </IconButton>
            </Toolbar>
            </AppBar>
            <Post postLikes = {post.postLikes} createTime = {post.createTime} postId = {post.id} userId = {post.userId} username = {post.username} title={post.title} text={post.text}/>
        </Dialog> : "loading"
    );
}
  
function UserActivity(props) {
    const {userId}  = props;
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    let navigate = useNavigate();

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    }

    const getActivity = () => {
        setIsLoaded(true);
        GetWithoutAuth("/posts?userId="+userId)
        .then(res => res.json())
        .then((result) => {
            setRows(result);
        })
        
    }

    React.useEffect(() => {
        getActivity();
    },[]);


    return(
        <div>
            {isOpen ? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen = {setIsOpen} /> : ""}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        User Activity
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <Post title={row.title} text={row.text} userId={row.userId} username={row.username}
                            createTime={row.createTime} postId={row.id} postLikes={row.postLikes}/>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </div>
    );
}

export default UserActivity;