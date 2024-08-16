import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DeleteWithAuth, refreshToken } from "../../services/HttpService";


function NotificationCard(props) {
    const {row, refreshNotification} = props;

    const handleOkundu = () => {
        DeleteWithAuth("/notification/"+ row.id)
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
                  handleOkundu();
                }
              })
              .catch((err) => {
                console.log("err", err);
              })
            }
          })
          .then((result) => {
            refreshNotification();
          })
          .catch(err => console.log(err))
    }

    return(
        <Card sx={{ minWidth: 275 }}>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
             {row.type === 1 ? <div>{row.username} add a comments at your "{row.postName}" posts</div> :
             row.type === 2 ? <div>{row.username} likes "{row.postName}" posts</div> :
             row.type === 3 ? <div>{row.username} follow you</div> :
             <div>There are some problems</div>}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={handleOkundu}>Okundu</Button>
        </CardActions>
        </Card>
    );
}

export default NotificationCard;