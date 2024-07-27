import React from "react";
import { Avatar, CardContent, CardHeader, InputAdornment, OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";
import "./Comments.scss"


function Comment(props) {
    const {text, userId, username} = props;

    return(
        <CardContent >
            <OutlinedInput
            id='outlined-adornment-amont'
            multiline
            inputProps={{maxLength : 250}}
            fullWidth   
            value = {text}
            disabled
            startAdornment = {
                <InputAdornment position="start">
                    <Link to={{pathname : '/users/'+ userId}} className='link'>
                        <Avatar aria-label="recipe" className="bgColor">
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }
            style = {{color: "black", backgroundColor: "white"}}
            ></OutlinedInput>

        </CardContent>
    );
}

export default Comment;
