import React, { useState } from "react";
import { Button, FormControl, Input, InputLabel, FormHelperText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostWithAuth } from "../../services/HttpService";


function Auth() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    let navigate = useNavigate();

    const handleUsername = (value) => {
        setUsername(value);
    }

    const handlePassword = (value) => {
        setPassword(value);
    }


    const handleButton = (path) => {
        sendRequest(path);
        setUsername("");
        setPassword("");
    }

    const sendRequest = (path) => {
        PostWithAuth("/auth/"+path, {username:username,password:password})
        .then((res) => res.json())
        .then(
            (result) => {
                localStorage.setItem("tokenKey",result.accessToken);
                localStorage.setItem("refreshKey",result.refreshToken);
                localStorage.setItem("currentUser",result.userId);
                localStorage.setItem("username",username)
                navigate(0);
            }
        )
        .catch((err) => console.log("err", err))
    }

    return(
        <FormControl>
            <InputLabel style={{top:10}}>Username</InputLabel>
            <Input 
                style={{top:10}}
                value={username}
                onChange={(i) => handleUsername(i.target.value)}
            />
            <InputLabel style={{top:80}}>Password</InputLabel>
            <Input 
                style={{top:40}}
                value={password}
                onChange={(i) => handlePassword(i.target.value)}
            />
            <Button variant="contained"
                style={{marginTop: 60,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color:'white'
                }}
                onClick={() => handleButton("register")}
                >Register</Button>
            <FormHelperText style={{margin:20}}>Are you already registered?</FormHelperText>
            <Button variant="contained"
                style={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color:'white'
                }}
                onClick={() => handleButton("login")}
                >Login</Button>
        </FormControl>
    );


}

export default Auth;