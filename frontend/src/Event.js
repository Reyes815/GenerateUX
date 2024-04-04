import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import bg1 from "./assets/images/bg/bg1.jpg";
import { Button, Table } from 'reactstrap';
import { Paper } from '@mui/material';
import { EventContext } from './Eventcontext';
import axios from 'axios';

function EventPage() {
  const { event_id } = useContext(EventContext);
  const [event, setEvent] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const responseEvent = await axios.get(`http://localhost/metro%20events/get_event.php`, {
          params: {
            event_id: event_id,
          },
        });
        setEvent(responseEvent.data);

        // Fetch user list based on organizer_id
        const formData = new FormData();
        formData.append('organizer_id', responseEvent.data.organizer);
        formData.append('event_id', event_id)
        const responseUserList = await axios.post('http://localhost/metro%20events/joined_events.php', formData);
        const userListWithUsername = await Promise.all(
          responseUserList.data.map(async (user) => {
            const usernameResponse = await axios.get('http://localhost/metro%20events/get_username.php', {
              params: {
                user_id: user.user_id,
              },
            });
            return { ...user, username: usernameResponse.data.user_name };
          })
        );
        setUserList(userListWithUsername);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [event_id]);

  const handleApprove = async (joinEventId) => {
    const formData = new FormData();
    formData.append('joinEvent_id', joinEventId);
    try {
      const response = await axios.post('http://localhost/metro%20events/approve_user_for_event.php', formData);
      console.log(response);
      if (response.data.success) {
        // Update status in userList
        const updatedUserList = userList.map(user =>
          user.joinEvent_id === joinEventId ? { ...user, status: 1 } : user
        );
        setUserList(updatedUserList);
      }
    } catch (error) {
      console.error('Error updating join status:', error);
    }
  };

  const handleDeny = async (joinEventId) => {
    const formData = new FormData();
    formData.append('joinEvent_id', joinEventId);
    try {
      const response = await axios.post('http://localhost/metro%20events/deny_user_for_event.php', formData);
      console.log(response);
      if (response.data.success) {
        // Update status in userList
        const updatedUserList = userList.map(user =>
          user.joinEvent_id === joinEventId ? { ...user, status: 2 } : user
        );
        setUserList(updatedUserList);
      }
    } catch (error) {
      console.error('Error updating join status:', error);
    }
  };

  if (!event) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }


  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& > :not(style)': {
          m: 1,
          width: '80%',
        },
      }}
    >
      <Paper elevation={6} style={{ flexWrap: 'wrap' }}>
        <img src={bg1} alt="Card image cap" width={'100%'} />

        <div style={{ paddingLeft: '5%', paddingRight: '5%', paddingBottom: '5%', marginTop: '5%', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" style={{ marginBottom: '10px' }}>
              {event.event_name}
            </Typography>
            <Typography variant="subtitle" style={{ marginBottom: '10px' }}>
              {event.event_datetime}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              {event.event_description}
            </Typography>
          </div>

          <div>
            <Typography variant="h5">
              {event.status == 1 ? (
                <p>Status: Open</p>
              ) : event.status == 0 ? (
                <p>Status: Cancelled</p>
              ) : (
                <p>Status: Unknown</p>
              )}
            </Typography>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3>Event Attendees:</h3>
          <Table style={{ width: '90%', margin: '3% auto', textAlign: 'center' }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Date & Time</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.dateTime}</td>
                  <td>
                    {user.status === 0 ? (
                      <Button styple={{ width: '100px'}} onClick={() => handleApprove(user.joinEvent_id)}>Approve</Button>
                    ) : user.status === 1 ? (
                      <Button disabled style={{ backgroundColor: 'green', width: '100px' }}>Approved</Button>
                    ) : (
                      <Button disabled style={{ width: '100px' }}>Approve</Button>
                    )}
                    
                    {user.status === 0 ? (
                        <Button style={{ marginLeft: '10px', width: '100px' }} onClick={() => handleDeny(user.joinEvent_id)}>Deny</Button>
                      ) : user.status === 1 ? (
                        <Button disabled style={{ marginLeft: '10px', width: '100px' }}>Deny</Button>
                      ) : (
                        <Button disabled style={{ marginLeft: '10px', backgroundColor: 'red', width: '100px' }}>Denied</Button>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Paper>
    </Box>
  );
}

export default EventPage;
