import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Breadcrumb, Button } from "react-bootstrap";
import profilePicture from "../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

const getUserData = async (token) => {
  try {
    const response = await api.get("/user/me", getAuthHeaders(token));
    return response.data;
  } catch (err) {
    console.error("Error fetching user data:", err.response?.data || err.message);
    throw err;
  }
};

const getTeamMembers = async (token) => {
  try {
    const response = await api.get("/teamMembers", getAuthHeaders(token));
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log("No team members found.");
      return [];
    }
    console.error("Error fetching team members:", err.response?.data || err.message);
    throw err;
  }
};

const deleteTeamMember = async (teamMemberId, token) => {
  try {
    const response = await api.delete(`/teamMembers/${teamMemberId}`, getAuthHeaders(token));
    return response.data;
  } catch (err) {
    console.error("Error deleting team member:", err);
    throw err;
  }
};

// Removed the unused updateTeamMember function

const TeamMemberDashboard = () => {
  const [, setUserData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        setError("No token found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserData(token);
        setUserData(data);
        const members = await getTeamMembers(token);
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTeamMember = async (teamMemberId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    if (!teamMemberId) {
      setError("Invalid team member ID.");
      return;
    }
  
    try {
      await deleteTeamMember(teamMemberId, token);
      const updatedMembers = await getTeamMembers(token);
      setTeamMembers(updatedMembers);
    } catch (err) {
      console.error("Error deleting team member:", err);
      setError("An error occurred while deleting the team member.");
    }
  };

  if (error) {
    return <h2>{error}</h2>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <main>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>My team</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex align-items-center">
        <h2>My team</h2>
        <Link className="btn-create" to="/myteam/addteammember">
          +
        </Link>
      </div>

      <p>
        {teamMembers.length
          ? `You have ${teamMembers.length} ${
              teamMembers.length === 1 ? "team member" : "team members"
            }:`
          : "Please add your first team member to get started!"}
      </p>

      {teamMembers.length > 0 ? (
        <Row xs={1} md={3} xl={5} className="g-4">
          {teamMembers.map((item) => (
            <Col key={item._id} className="container-fluid g-4">
              <Card className="card border-0 h-100 d-flex text-center">
                <Card.Img
                  src={item.image || profilePicture}
                  alt={`The cover for ${item.username}`}
                  variant="top"
                />
                <Card.Body>
                  <Card.Title>
                    <h3>{item.username}</h3>
                  </Card.Title>
                  <Card.Text>{item.role}</Card.Text>
                  <Card.Text>
                    <b>{item.efficiency}</b> efficiency,{" "}
                    <b>{item.hoursPerWeek}</b> hours/week
                  </Card.Text>
                  <div className="d-flex justify-content-around">
                    <Button
                      className="btn"
                      variant="success"
                      onClick={() => {
                        navigate(`/myteam/addteammember`, {
                          state: {
                            isEditing: true,
                            teamMember: item
                          }
                        })
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      className="btn"
                      variant="danger"
                      onClick={() => handleDeleteTeamMember(item._id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No team members found. Add your first team member to get started!</p>
      )}
    </main>
  );
};

export default TeamMemberDashboard;