import React from "react";
import { Avatar, CardContent, InputAdornment, makeStyles, OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";



function Comment(props) {
    const {text, userId, username} = props;

    return(
        <CardContent >
            <OutlinedInput
            id='outlined-adornment-amont'
            multiline
            inputProps={{maxLength : 25}}
            fullWidth
            value = {text}
            disabled
            startAdorment = {
                <InputAdornment position="start">
                    <Link to={{pathname : '/users/'+ userId}}>
                        <Avatar aria-label="recipe" >
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
