import React, { useState } from "react";
import { Avatar, Button, CardContent, CardHeader, InputAdornment, OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";
import "./Comments.scss";
import { PostWithAuth, refreshToken } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

function CommentForm(props) {
    const  {userId, username, postId, refreshComments} = props;
    const [text, setText] = useState("");
    let navigate = useNavigate();

    const handleSubmit = () => {
        saveComment();
        setText("");
    }

    const handleChange = (value) => {
        setText(value);
    }

    const saveComment = () => {
        PostWithAuth("/comments",{postId:postId, userId:userId, text:text})
        .then((res) => {
          debugger;
            if(res.ok) {
              return res.json();
            }
            else if(res.status == 401) {
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
                  saveComment();
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
        .then(() => {
            refreshComments();
        })
    }


    return(
        <CardContent >
            <OutlinedInput
            id='outlined-adornment-amont'
            multiline
            inputProps={{maxLength : 250}}
            fullWidth
            onChange={(i) => handleChange(i.target.value)}
            startAdornment = {
                <InputAdornment position="start">
                    <Link to={{pathname : '/users/'+ userId}} className='link'>
                        <Avatar aria-label="recipe" className="bgColor">
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
