import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Button, CardImg, Modal, ModalBody, ModalFooter, Alert, Tooltip } from 'reactstrap';
import bg1 from "../../assets/images/bg/bg1.jpg";
import { UserContext } from '../../Usercontext';
import { EventContext } from '../../Eventcontext';
import { useNavigate } from 'react-router-dom';

function UserPage() {
  const { user_id } = useContext(UserContext);
  const { setEventid } = useContext(EventContext);
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showModalDetail, setShowModalDetail] = useState(false); // State to control modal visibility
  const [showModalNotif, setshowModalnotif] = useState(false);
  const [eventComments, setEventComments] = useState([]); // State to store comments for the selected event
  const [tooltipOpen, setTooltipOpen] = useState({}); // State for tooltip visibility, each key corresponds to an event ID
  const [notificationData, setNotificationData] = useState([]);// State to store comments for the selected event
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    // Fetch events data
    async function fetchEvents() {
      try {
        const eventsResponse = await axios.get('http://localhost/metro%20events/events.php');
        if (eventsResponse.data.success) {
          const eventsWithUpvotes = await Promise.all(eventsResponse.data.events.map(async event => {
            try {
              // Fetch upvotes count for each event
              const upvotesResponse = await axios.get(`http://localhost/metro%20events/get_upvotes.php?event_id=${event.id}`);
              if (upvotesResponse.data.success) {
                console.log(upvotesResponse.data.events[event.id-5].upvotes);
                const upvotesCount = upvotesResponse.data.events[event.id-5].upvotes || 0; // Change this line
                return { ...event, upvotes: upvotesCount, comments: [] };
              } else {
                console.log('Failed to fetch upvotes:', upvotesResponse.data.message);
                return { ...event, upvotes: 0, comments: [] };
              }
            } catch (error) {
              console.error('Error fetching upvotes:', error);
              return { ...event, upvotes: 0, comments: [] };
            }
          }));
          setEvents(eventsWithUpvotes);
        } else {
          setErrorMessage(eventsResponse.data.message || 'Failed to fetch events.');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('An error occurred while fetching events.');
      }
    }
    

    fetchEvents();
  }, [refreshPage]);
  
  const handleUpvote = async (eventId) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('eventid', eventId);
  
    try {
      const response = await axios.post('http://localhost/metro%20events/handle_upvote.php', formData);
      console.log(response.data);
      setSelectedEvent.upvotes = response.data;
        setRequestSent(true);
        setErrorMessage(response.data.message || 'Upvote Successful');
        setSelectedEvent.upvotes = response.data ;
        toggleModalDetail();
        setRefreshPage(true);
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while upvoting. Please try again later.');
    }
  };
  
  
  const handleComment = async (eventId, comment) => {
    if(comment != ""){

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('eventid', eventId);
    formData.append('comment', comment);
    
    try {
      const response = await axios.post('http://localhost/metro%20events/handle_comment.php', formData);
      console.log(response.data);
      
      setEvents(prevEvents => prevEvents.map(event => {
        if (event.id === eventId) {
          return { ...event, comments: [...event.comments, commentInput] };
        }
        return event;
      }));
      
      // Toggle modal after successfully adding the comment
      toggleModalDetail();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while adding a comment. Please try again later.');
    }
  }
  };
  

  const toggleModalDetail = () => setShowModalDetail(!showModalDetail);
  const toggleModalNotif = () => setshowModalnotif(!showModalNotif);

  const openModalevent= async (event) => {
    setSelectedEvent(event);
    toggleModalDetail();
  
    try {
      // Fetch comments for the selected event
      const commentsResponse = await axios.get(`http://localhost/metro%20events/get_comments.php?event_id=${event.id}`);
      
      if (commentsResponse.data.success) {
        setEventComments(commentsResponse.data.comments || []);
      } else {
        console.log('Failed to fetch comments:', commentsResponse.data.message);
      }
  
      // Fetch upvotes count for the selected event
      const upvotesResponse = await axios.get(`http://localhost/metro%20events/get_upvotes.php?event_id=${event.id}`);
      
      if (upvotesResponse.data.success) {
        setSelectedEvent(prevState => ({ ...prevState, upvotes: upvotesResponse.data.upvotes }));
      } else {
        console.log('Failed to fetch upvotes:', upvotesResponse.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  


  const openModal = async () => {

    const formData = new FormData();
    formData.append('user_id', user_id);
    
    try {
      const response = await axios.post('http://localhost/metro%20events/notification.php', formData);

      console.log(response.data);
      
      if (response.data && response.data.length > 0) {
        setNotificationData(response.data);
        toggleModalNotif();
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      setErrorMessage('An error occurred while fetching notification.');
    }
  };

  const handleJoinEvent = async (eventId, orgId) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('eventid', eventId);
    formData.append('organizer_id', orgId);
    try {
      console.log(user_id + ", " + eventId);
      const response = await axios.post('http://localhost/metro%20events/join_event.php', formData);
      console.log(response);
      if (response.data.success) {
        setErrorMessage('Request sent successfully');
      } else {
        setErrorMessage(response.data.message || 'Failed to join event. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while joining event. Please try again later.');
    }
  };

  const handleAttendeesPage = async (event_id) => {
    setEventid(event_id);
    navigate('/user/attendees');
  }

  return (
    <div className="container">
      <h1 className="text-center" style={{ color: '#008DDA' }}>Welcome User!</h1>
      <h5 className="mb-3">Events</h5>
      <div className="row">
        {events.map(event => (
          <div key={event.id} className="col-lg-6 mb-4">
            <Card>
              <CardImg alt="Card image cap" src={bg1} />
              <CardBody>
              <div style={{ display: 'flex' }}>
                  <CardTitle
                    tag="h5"
                    id={`tooltipTitle-${event.id}`}
                    style={{ cursor: 'pointer' }}
                    onMouseOver={() => setTooltipOpen(prevState => ({ ...prevState, [event.id]: true }))}
                    onMouseLeave={() => setTooltipOpen(prevState => ({ ...prevState, [event.id]: false }))}
                    onClick={() => handleAttendeesPage(event.id)}
                  >
                    {event.name}
                  </CardTitle>
                  <Tooltip
                    target={`tooltipTitle-${event.id}`}
                    isOpen={tooltipOpen[event.id] || false}
                  >
                    Click to View Attendees
                  </Tooltip>
                </div>
                <CardSubtitle>{event.date}</CardSubtitle>
                <CardText>{event.description}</CardText>
                <Button color="info" style={{ marginRight: '10px' , width: '125px'}} onClick={() => openModalevent(event)}>View Details</Button>
                <Button color="info" style={{ marginRight: '10px' , width: '125px'}} onClick={() => handleJoinEvent(event.id, event.org_id)}>Join Event</Button>
                {event.status == 0 && <Alert color="warning">This event is no longer available</Alert>}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      
      <Modal isOpen={showModalDetail} toggle={toggleModalDetail}>
        <ModalBody>
          {selectedEvent && (
            <>
              <h3>{selectedEvent.name}</h3>
              <p>{selectedEvent.date}</p>
              <p>{selectedEvent.description}</p>
              <Button color="info" onClick={() => handleUpvote(selectedEvent.id)}>Upvote ({selectedEvent.upvotes})</Button>
              <ul>
                {eventComments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              <input 
                type="text" 
                placeholder="Add a comment" 
                onChange={(e) => setCommentInput(e.target.value)} />
              <Button color="info" onClick={() => handleComment(selectedEvent.id, commentInput)}>Comment</Button>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalDetail}>Close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showModalNotif} toggle={toggleModalNotif}>
        <ModalBody>
        <div style={{ marginBottom: '30px'}}>
          <h2>Notifications</h2>
        </div>
        {notificationData.map((notification, index) => (
            <div key={index}>
              <p><strong>Event Name:</strong> {notification.event_name}</p>
              <p><strong>Cancel Reason:</strong> {notification.cancel_reason}</p>
              <hr />
            </div>
          ))}
          {errorMessage && <p>{errorMessage}</p>}
        </ModalBody>
        <ModalFooter>
              <Button color="secondary" onClick={toggleModalNotif}>Close</Button>
        </ModalFooter>
      </Modal>
      {errorMessage && <p className="text-center" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default UserPage;