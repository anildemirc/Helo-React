import React from 'react';

import AvatarCard from './AvatarCard';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';


export default function AvatarList(props) {
  const {followingList} = props;

  return (
    <div>
      {(followingList != undefined && followingList.length > 0) ? 
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
          <TableHead>
              <TableRow>
                  List
              </TableRow>
          </TableHead>
          <TableBody>
          {followingList.map((row) => {
              return (
                  <AvatarCard username={row.username} userInfo={"User Info"} followerCount={row.countFollower} followedCount={row.countFollowed} />
              );
          })}
          </TableBody>
          </Table>
        </TableContainer>
        : "No Any User"
      }
    </div>
  );
}