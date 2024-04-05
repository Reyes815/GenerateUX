import React, { useContext, useState } from "react";
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
  const { setUser_id } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const { data: userData } = await axios.get("http://localhost:4000/users");

        // Check if any user matches the provided username and password
        const user = userData.find(user => user.username === username && user.password === password);

        if (user) {
            // If a user is found, perform actions accordingly
            console.log("Login successful:", user);
            setUser_id(user.id);
            navigate(`/user`);
        } else {
            // If no user is found, display an error message
            setMessage("Invalid username or password.");
        }
    } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later.");
    }
};


  return (
    <Row>
      <Col>
        <Card>
          <CardTitle
            tag="h6"
            className="border-bottom p-3 mb-0"
            style={{ textAlign: "center", color: "#008DDA" }}
          >
            Welcome to Metro Events!
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
                <p style={linkStyle}>
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

const linkStyle = {
  display: "inline",
  textDecoration: "none",
  color: "#000000",
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
