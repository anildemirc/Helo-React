import {React, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link, ListItemSecondaryAction, Radio } from '@mui/material';
import { DeleteWithAuth, GetWithAuth, PostWithAuth, PutWithAuth, refreshToken } from '../../services/HttpService';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './Avatar.scss';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

  function Avatar(props) {
    const {avatarId, userId, username, countFollowed, countFollower} = props;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);
    const [followedCount, setFollowedCount] = useState(countFollowed);
    const [followerCount, setFollowerCount] = useState(countFollower);
    const [following , setFollowing] = useState(null);
    let navigate = useNavigate();

    const saveAvatar = () => {
      PutWithAuth("/users/"+ localStorage.getItem("currentUser"), {avatar: selectedValue})
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
              saveAvatar();
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then((result) => {

      })
      .catch((err) => console.log("err", err))
    }

    const follow = () => {
      console.log("userId ", userId);
      PostWithAuth("/follow",{followedId: userId, followerId: localStorage.getItem("currentUser")})
      .then((res) => {
        if(res.ok) {
          return res.json();
        }
        else {
          refreshToken()
          .then((res) => {
            if(res.ok) {
               res.json();
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
              return follow();
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then((result) => {
        setFollowing(result);
        setFollowedCount(followedCount+1);
      })
      .catch((err) => console.log(err))
    }

    const unfollow = () => {
      DeleteWithAuth("/follow/"+following.id)
      .then((res) => {
        if(!res.ok) {
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
              unfollow();
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then(() => {
        setFollowedCount(followedCount-1);
        setFollowing(null);
      })
      .catch((err) => console.log(err))
    }

    const checkFollowing = () => {
      GetWithAuth("/follow?followedId="+ userId+"&followerId="+localStorage.getItem("currentUser"))
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
              checkFollowing();
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then((result) => {
        console.log("checkFollowing result",result);
        setFollowing(result);
      })
      .catch(err => console.log(err))
    }
  
    const handleFollow = () => {
      follow();
    }

    const handleUnFollow = () => {
      unfollow();
    }
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      saveAvatar();
    };

    useEffect((() => {
      if((userId+"" !== localStorage.getItem("currentUser")) && localStorage.getItem("currentUser") != undefined) {
        checkFollowing(); 
      }
    }),[]);
  
    return (
      <div>
      <Card sx={{maxWidth: 345, margin: 5}}>
          <CardMedia
            component="img"
            alt="User Avatar"
            image={`/avatars/avatar${selectedValue}.png`}
            title="User Avatar"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {username}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              User info
            </Typography>
          </CardContent>
        <CardActions>
          <div>
            {localStorage.getItem("currentUser") === ""+userId ? 
              <Button size="small" color="primary"  onClick={handleOpen}>
              Change Avatar
              </Button> : 
              following == undefined ?
              <Button size="small" color="primary"  onClick={handleFollow}>Follow</Button> : 
              <Button size="small" color="primary"  onClick={handleUnFollow}>Unfollow</Button>
            }
            <br/>
            <Link to={{pathname : '/followers/'+ userId}} className='linkee'>{followerCount} following</Link>
            <Link to={{pathname : '/following/'+ userId}} className='linkee'>{followedCount} followers</Link>
          </div>
        </CardActions>
      </Card>
      <Modal
      sx={{display: "flex", maxWidth: 200, marginLeft: 50}}
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      >
      <Box sx={style}>
        <List dense>
            {[1, 2, 3, 4, 5, 6].map((key) => {
            const labelId = `checkbox-list-secondary-label-${key}`;
            return (
                <ListItem key={key} button>
                    <CardMedia
                    sx = {{maxWidth: 100}}
                    component="img"
                    alt={`Avatar n°${key}`}
                    image={`/avatars/avatar${key}.png`}
                    title="User Avatar"
                    />
                <ListItemSecondaryAction>
                    <Radio
                    edge="end"
                    value= {key}
                    onChange={handleChange}
                    checked={""+selectedValue === ""+key}
                    inputProps={{ 'aria-labelledby': labelId }}
                    />
                </ListItemSecondaryAction>
                </ListItem>
            );
            })}
        </List>
      </Box>
      </Modal>
      </div>
    );
  }
  export default Avatar;