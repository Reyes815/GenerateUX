import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { UserContext } from "../../Usercontext";

const SavedWireframes = () => {
  const [wireframes, setWireframes] = useState([]);
  const { user_id } = useContext(UserContext);

  useEffect(() => {
    const fetchWireframes = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/wireframes/${user_id}`);
        setWireframes(data);
      } catch (error) {
        console.error("Error fetching wireframes:", error);
      }
    };

    fetchWireframes();
  }, [user_id]);

  return (
    <Row>
      {wireframes.map((wireframe, index) => (
        <Col md="6" lg="4" key={index}>
          <Card className="mb-4">
            <CardTitle
              tag="h6"
              className="border-bottom p-3 mb-0 d-flex align-items-center justify-content-center"
              style={{ color: "#008DDA" }}
            >
              Wireframe {index + 1}
            </CardTitle>
            <CardBody
              dangerouslySetInnerHTML={{ __html: wireframe.htmlCode }}
              style={wireframeStyle}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const wireframeStyle = {
  border: "1px solid #41C9E2",
  borderRadius: "4px",
  padding: "10px",
  backgroundColor: "#f8f9fa",
};

export default SavedWireframes;
