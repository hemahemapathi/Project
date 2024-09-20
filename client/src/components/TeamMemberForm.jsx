import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createTeamMember } from "../utils/API";
import Auth from "../utils/auth";
import { getSavedUserId } from "../utils/localStorage";

const TeamMemberForm = () => {
  const navigate = useNavigate();

  const [teamMemberFormData, setTeamMemberFormData] = useState({
    username: "",
    role: "",
    efficiency: 1,
    hoursPerWeek: 40,
    manager: getSavedUserId(),
  });

  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTeamMemberFormData({ ...teamMemberFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
    setShowAlert(false);
    setErrorMessage("");
    setSuccessMessage("");

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      setShowAlert(true);
      setErrorMessage("You need to be logged in to add a team member.");
      return;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    try {
      await createTeamMember(teamMemberFormData, token);
      
      setSuccessMessage("Team member added successfully!");
      setTeamMemberFormData({
        username: "",
        role: "",
        efficiency: 1,
        hoursPerWeek: 40,
        manager: getSavedUserId(),
      });
      setValidated(false);
      setTimeout(() => navigate("/myteam"), 2000);
    } catch (err) {
      console.error("Error adding team member:", err);
      setShowAlert(true);
      setErrorMessage(err.message || "An error occurred while adding the team member. Please try again.");
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Alert
        dismissible
        onClose={() => setShowAlert(false)}
        show={showAlert}
        variant="danger"
      >
        {errorMessage || "Something went wrong. Please try again."}
      </Alert>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter team member's username"
          name="username"
          value={teamMemberFormData.username}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">Please add a username.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRole">
        <Form.Label>Role</Form.Label>
        <Form.Select
          name="role"
          value={teamMemberFormData.role}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Choose an option
          </option>
          <option>Senior back-end dev</option>
          <option>Senior front-end dev</option>
          <option>Senior full-stack dev</option>
          <option>Junior back-end dev</option>
          <option>Junior front-end dev</option>
          <option>Junior full-stack dev</option>
          <option>Intern</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">Please select a role.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEfficiency">
        <Form.Label>Efficiency</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter efficiency (1 = average)"
          name="efficiency"
          min="0.1"
          max="3"
          step="0.1"
          value={teamMemberFormData.efficiency}
          onChange={handleInputChange}
          required
        />
        <Form.Text muted>
          Proportional to 1: Efficiency {"<"} 1 is faster, 1 is average, {" >"} 1 is slower.
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          Please provide a valid efficiency.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formHoursPerWeek">
        <Form.Label>Hours per Week</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter hours per week"
          name="hoursPerWeek"
          min="1"
          max="40"
          value={teamMemberFormData.hoursPerWeek}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide the number of hours.
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Team Member
      </Button>
    </Form>
  );
};

export default TeamMemberForm;
