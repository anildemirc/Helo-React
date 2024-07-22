import React, { useState } from "react";
import { Avatar, Button, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";
import "./Comments.scss";


function CommentForm(props) {
    const  {userId, username, postId, refreshComments} = props;
    const [text, setText] = useState("");

    const handleSubmit = () => {
        saveComment();
        setText("");
        refreshComments();
    }

    const handleChange = (value) => {
        console.log(value);
        setText(value);
    }

    const saveComment = () => {
        fetch("/comments", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                postId:postId,
                userId:userId,
                text:text,
            }),
        })
        .then((res) => res.json())
        .catch((err) => console.log("error"))
    }


    return(
        <CardContent >
            <OutlinedInput
            id='outlined-adornment-amont'
            multiline
            inputProps={{maxLength : 250}}
            fullWidth
            onChange={(i) => handleChange(i.target.value)}
            startAdorment = {
                <InputAdornment position="start">
                    <Link to={{pathname : '/users/'+ userId}}>
                        <Avatar aria-label="recipe" >
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }
            endAdornment= {
                <InputAdornment position="end">
                    <Button 
                        variant="contained"
                        onClick={handleSubmit}
                        className="clr-white bg-color"
                    >Comment</Button>
                </InputAdornment>
            }
            style = {{color: "black", backgroundColor: "white"}}
            ></OutlinedInput>

        </CardContent>
    );
}

export default CommentForm;
