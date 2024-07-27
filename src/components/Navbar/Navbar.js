import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import "./Navbar.scss";
import { LockOpen } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

function NavBar() {
    let navigate = useNavigate();

    const onClick  = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey");
        navigate(0);
    }

    return(
        <div>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" className="link">Quest App</Link>
                </Typography>
                <Typography variant="h6" component="div">
                    {localStorage.getItem("currentUser") == null ? <Link to="/auth" className="link">Login/Register</Link> :
                    <div>
                        <IconButton className="link" onClick={() => onClick()}>
                            <LockOpen>
                            </LockOpen>
                        </IconButton>
                        <Link to={{pathname : '/users/' + localStorage.getItem("currentUser")}} className="link">Profile</Link>
                    </div>}
                </Typography>
                </Toolbar>
            </AppBar>
            </Box>
        </div>
    );


}

export default NavBar;