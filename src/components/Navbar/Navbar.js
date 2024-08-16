import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Link } from 'react-router-dom';
import "./Navbar.scss";
import { LockOpen } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { GetWithAuth, refreshToken } from '../../services/HttpService';
import NotificationList from '../Notification/NotificationList';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NavBar() {
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [notificationList, setNotificationList] = React.useState([]);
    const onClick  = () => {
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("refreshKey");
        navigate(0);
    }

    const onClickNotification = () => {
        GetWithAuth("/notification?userId="+localStorage.getItem("currentUser"))
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
                  return;
                }
              })
              .then((result) => {
                if(result != undefined) {
                  localStorage.setItem("tokenKey", result.accessToken);
                  onClickNotification();
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
          .then((result) => {
            console.log("result", result);
            setNotificationList(result);
            handleClickOpen();
          })
          .catch(err => console.log(err))
    }



    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };


    return(
        <div>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>Notifications</DialogTitle>
              <DialogContent>
                <NotificationList notificationList={notificationList} refreshNotification={onClickNotification} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>More...</Button>
              </DialogActions>
            </Dialog>
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
                        <IconButton className='link' onClick={() => onClickNotification()}>
                          <NotificationsIcon/>
                        </IconButton>
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