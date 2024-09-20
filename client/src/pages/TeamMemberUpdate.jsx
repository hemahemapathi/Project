import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Breadcrumb } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Import axios
import Auth from "../utils/auth";

const TeamMemberUpdate = () => {
  const navigate = useNavigate(); // Updated to useNavigate
  const { teamMemberId } = useParams();
  const [teamMemberData, setTeamMemberData] = useState({});
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Function to fetch team member data
  const getTeamMember = async (teamMemberId, token) => {
    try {
      const response = await axios.get(`/api/teamMembers/${teamMemberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Function to update team member data
  const updateTeamMember = async (teamMemberId, data, token) => {
    try {
      const response = await axios.put(`/api/teamMembers/${teamMemberId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // UseEffect to fetch data when component mounts
  useEffect(() => {
    const getTeamMemberData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        const response = await getTeamMember(teamMemberId, token);
        if (!response || !response.data) {
          throw new Error("Something went wrong.");
        }
        setTeamMemberData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getTeamMemberData();
  }, [teamMemberId]);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTeamMemberData({ ...teamMemberData, [name]: value });
  };

  // Handle form submission for updating the team member
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await updateTeamMember(teamMemberId, teamMemberData, token);
      if (!response || response.status !== 200) {
        throw new Error("Something went wrong when updating team member.");
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    navigate("/myteam"); // Navigate to the team list page after updating
  };

  return (
    <main>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/myteam" }}>My team</Breadcrumb.Item>
        <Breadcrumb.Item active>Update team member</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Update {teamMemberData.username}'s profile</h2>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong.
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="New team member's username"
            name="username"
            onChange={handleInputChange}
            value={teamMemberData.username || ""}
            required
          />
          <Form.Control.Feedback type="invalid" muted>Please add a username.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="role">Role</Form.Label>
          <Form.Select
            name="role"
            onChange={handleInputChange}
            value={teamMemberData.role || ""}
            required>
            <option>Choose an option</option>
            <option>Senior back-end dev</option>
            <option>Senior front-end dev</option>
            <option>Senior full-stack dev</option>
            <option>Junior back-end dev</option>
            <option>Junior front-end dev</option>
            <option>Junior full-stack dev</option>
            <option>Intern</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid" muted>Please add role.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="efficiency">Efficiency</Form.Label>
          <Form.Control
            type="number"
            placeholder="New team member's efficiency"
            name="efficiency"
            min="0"
            max="3"
            onChange={handleInputChange}
            value={teamMemberData.efficiency || ""}
            required
          />
          <Form.Text muted>
            Proportional to 1, such that 0 {"<"} 1 = faster than average, 1 = average, {">"} 1 = slower than average.
          </Form.Text>
          <Form.Control.Feedback type="invalid" muted>Please add an efficiency estimate.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="hoursPerWeek">Hours/week</Form.Label>
          <Form.Control
            type="number"
            placeholder="Number of hours/week"
            name="hoursPerWeek"
            min="0"
            max="40"
            onChange={handleInputChange}
            value={teamMemberData.hoursPerWeek || ""}
            required
          />
          <Form.Control.Feedback type="invalid" muted>Please add an hours per week estimate.</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="success">Save</Button>
      </Form>
    </main>
  );
};

export default TeamMemberUpdate;
