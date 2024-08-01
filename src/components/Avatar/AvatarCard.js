import * as React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Avatar, CardContent, CardHeader } from '@mui/material';
import AvatarList from './AvatarList';
import Typography from '@mui/material/Typography';
import './Avatar.scss';
import { GetWithAuth, refreshToken } from "../../services/HttpService";

function AvatarCard(props) {
  let navigate = useNavigate();
  const {userId, username, userInfo, followerCount, followedCount} = props;
  const [followerList, setFollowerList] = React.useState(null);
  const [followedList, setFollowedList] = React.useState(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(null);

  return (
    <div style={{border: '1px solid #dadde9'}}>
      <CardHeader
        avatar={
          <Avatar className='bgColor' aria-label="recipe">
            {username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={test(username)}
      />
      <Typography gutterBottom variant="h5" sx={{paddingLeft: 2}}>
          {userInfo}
        </Typography>
        
        <Typography>
          <Link to={{pathname : '/followers/'+ userId}} className='linkee'>{followerCount} following</Link>
          <Link to={{pathname : '/following/'+ userId}} className='linkee'>{followedCount} followers</Link>
        </Typography>
        {isPopupOpen != null ? <AvatarList type={isPopupOpen} userId={userId} open={true}/> : ""}
    </div>
  );
}

function test(username) {
  return (
    <CardContent>
      <Typography gutterBottom variant="h5">
        {username}
      </Typography>
    </CardContent>
  );
}

export default AvatarCard;