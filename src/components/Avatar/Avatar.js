import {React, useState} from 'react';
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
//import { PutWithAuth } from '../../services/HttpService';



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
    const {avatarId} = props;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);
    const [userId, setUserId] = useState(localStorage.getItem("currentUser"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
  
    const saveAvatar = () => {
      fetch("/users/"+ localStorage.getItem("currentUser"), {
          method: "PUT",
          headers: {"Content-Type":"application/json", "Authorization":localStorage.getItem("tokenKey")},
          body: JSON.stringify({
            avatar: selectedValue,
          }),
      })
      .then(res => res.json())
      .catch((err) => console.log(err))
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
          {localStorage.getItem("currentUser") === ""+userId ? <Button size="small" color="primary"  onClick={handleOpen}>
            Change Avatar
          </Button> : ""}
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