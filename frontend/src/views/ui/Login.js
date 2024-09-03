import React, { useContext, useState } from "react";
import UXLogo from 'C:/Users/delap/Projects/GenerateUX/frontend/src/assets/images/logos/UX.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { UserContext } from "../../Usercontext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const {user_id, setUser_id } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const postData = {
      username: username,
      password: password
    }

    try {
      const { data: user } = await axios.post('http://localhost:4000/login', postData);
      setUser_id(user.id);
      console.log(user_id);
      navigate(`/user`);
    } catch (error) {
        setMessage("Invalid username or password.");
    }
};


  return (
    <Row>
      <Col>
        <Card>
        <CardTitle
  tag="h6"
  className="border-bottom p-3 mb-0 d-flex align-items-center justify-content-center"
  style={{ color: "#008DDA" }}
>
  <img
    src={UXLogo}
    alt="UX Logo"
    style={{ width: "75px", height: "auto", marginRight: "10px", alignSelf: "flex-start" }} 
  />
  <span style={{ flex: 1, textAlign: "center" }}>Welcome to GenerateUX!</span>
</CardTitle>

          <CardBody>
            <Form onSubmit={handleLogin}>
              <FormGroup>
                <Label style={{ color: "#008DDA", display: "block" }} for="username">
                  Username
                </Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ ...inputStyle }}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: "#008DDA", display: "block" }} for="password">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle }}
                />
              </FormGroup>
              <div style={linkContainerStyle}>
                <p style={normalLinkStyle}>
                  Don't have an account?
                </p>
                <a href="/#/register" style={linkStyle}>
                  Register Now!
                </a>
              </div>
              <div style={{ textAlign: "center" }}>
                <Button type="submit" style={buttonStyle}>
                  Submit
                </Button>
              </div>
            </Form>
            <p style={messageStyle}>{message}</p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const inputStyle = {
  width: "100%",
  padding: "5px",
  borderRadius: "4px",
  border: "1px solid #41C9E2",
};

const linkContainerStyle = {
  textAlign: "center",
  marginTop: "10px",
};

const normalLinkStyle = {
  display: "inline",
  textDecoration: "none",
  color: "#000000",
  marginRight: "5px",
};

const linkStyle = {
  display: "inline",
  textDecoration: "none",
  color: "#41C9E2",
  marginRight: "5px",
};

const buttonStyle = {
  backgroundColor: "#41C9E2",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const messageStyle = {
  color: "#008DDA",
  textAlign: "center",
  marginTop: "10px",
};

export default Login;
