import React, { useState } from 'react';
import { Row, Col, Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const axiosPostData = async() => {
    const postData = {
      firstName: firstName,
      lastname: lastName,
      username: username,
      password: password,
    }

    await axios.post('http://localhost:4000/registration', postData)
    .then(res => setMessage(<p>{res.data}</p>))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!firstName) {
      setMessage('Firstname is empty')
    } else if(!lastName) {
      setMessage('Lastname is empty')
    } else if(!username) {
      setMessage('Username is empty')
    } else if(!password) {
      setMessage('Password is empty')
    } else {
      setMessage('Error')
    } 

    axiosPostData()
  };

  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0" style={{ textAlign: 'center', color: '#008DDA' }}>
            Start your journey now, here at GenerateUX!
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ display: 'inline', textDecoration: 'none', color: '#000000', marginRight: '5px' }}>Already have an account?</p>
                <a href="/#/login" style={{ textDecoration: 'none', color: '#41C9E2' }}>Login!</a>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  className="mt-2"
                  style={{
                    backgroundColor: '#41C9E2',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
            {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Registration;
