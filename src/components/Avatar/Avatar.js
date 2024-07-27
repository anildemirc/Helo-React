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
import { ListItemSecondaryAction, Radio } from '@mui/material';
import { DeleteWithAuth, GetWithAuth, PostWithAuth, PutWithAuth } from '../../services/HttpService';



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
    const {avatarId, userId, username, countFollowed} = props;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);
    const [followCount, setFollowCount] = useState(countFollowed)
    const [following , setFollowing] = useState(null);
  
    const saveAvatar = () => {
      PutWithAuth("/users/"+ localStorage.getItem("currentUser"), {avatar: selectedValue})
      .then(res => res.json())
      .catch((err) => console.log(err))
    }

    const follow = () => {
      PostWithAuth("/follow/",{followedId:localStorage.getItem("currentUser") , followerId: selectedValue})
      .then(res => res.json())
      .then(() => {

      })
      .catch((err) => console.log(err))
    }

    const unfollow = () => {
      DeleteWithAuth()
      .then(res => res.json())
      .then(() => {

      })
      .catch((err) => console.log(err))
    }

    const checkFollowing = () => {
      GetWithAuth("/follow?followedId="+ userId+"&followerId="+localStorage.getItem("currentUser"))
      .then(res => res.json())
      .then((result) => {
        setFollowing(result);
      })
      .catch((err) => console.log(err))
    }
  
    const handleFollow = () => {
      follow();
    }

    const handleUnFollow = () => {

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
      if(userId+"" !== localStorage.getItem("currentUser")) {
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
            </Button> : ""}
            {
              (localStorage.getItem("currentUser") != undefined && localStorage.getItem("currentUser") != userId) ? 
              following == undefined ?
              <Button size="small" color="primary"  onClick={handleFollow}>Follow</Button> : 
              <Button size="small" color="primary"  onClick={handleUnFollow}>Unfollow</Button> : ""
            }
            {followCount} followers
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