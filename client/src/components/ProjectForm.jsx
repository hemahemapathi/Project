import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createProject } from "../utils/API";
import Auth from "../utils/auth";
import { getSavedUserId } from "../utils/localStorage";

const ProjectForm = () => {
  const navigate = useNavigate();

  const [projectFormData, setProjectFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectUserStory: "",
    projectManager: getSavedUserId(),
  });

  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectFormData({ ...projectFormData, [name]: value });
  };

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
      setValidated(true);
      return;
    }

    try {
      const response = await createProject(projectFormData, token);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong when creating the project.");
      }

      const project = await response.json();
      const projectId = project._id;

      setProjectFormData({
        projectName: "",
        projectDescription: "",
        projectUserStory: "",
        projectManager: getSavedUserId(),
      });

      navigate(`/myprojects/${projectId}/features`);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setShowAlert(true);
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
        {errorMessage || "Something went wrong."}
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="projectName">Project Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Project X"
          name="projectName"
          onChange={handleInputChange}
          value={projectFormData.projectName}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a project name.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="projectDescription">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="Project X's description"
          name="projectDescription"
          onChange={handleInputChange}
          value={projectFormData.projectDescription}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a description for your project.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="projectUserStory">User Story</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="AS A... I WANT... SO THAT..."
          name="projectUserStory"
          onChange={handleInputChange}
          value={projectFormData.projectUserStory}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please provide a user story for your project.
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="success">
        Create Project
      </Button>
    </Form>
  );
};

export default ProjectForm;
