import React from "react";

import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import NotificationCard from "./NotificationCard";

function NotificationList(props) {
    const {notificationList, refreshNotification} = props;

    return (
        <div>
        {(notificationList != undefined && notificationList.length > 0) ? 
            <TableContainer sx={{ maxHeight: 800 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableBody>
                    {notificationList.map((row) => {
                        return (
                            <NotificationCard row={row} refreshNotification={refreshNotification} />
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
            : "No Any Notification"
        }
        </div>
    );
}

export default NotificationList;