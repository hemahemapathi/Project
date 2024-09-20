import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createTask } from "../utils/API";
import Auth from "../utils/auth";

const TaskForm = ({ projectId, featureId }) => {
  const navigate = useNavigate();

  // Initial state for form data
  const [taskFormData, setTaskFormData] = useState({
    taskName: "",
    taskAcceptanceCriteria: "",
    taskTimeEstimate: 0,
  });

  // State for form validation and alerts
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // For more detailed error messages

  // Input change handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskFormData({ ...taskFormData, [name]: value });
  };

  // Form submit handler
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    // Handle if token is not available
    if (!token) {
      setAlertMessage("You need to be logged in to create a task.");
      setShowAlert(true);
      return;
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Try to create the task
    try {
      const response = await createTask(projectId, featureId, taskFormData, token);

      if (!response.ok) {
        const errorData = await response.json(); // In case the server provides more detailed error info
        throw new Error(errorData.message || "Something went wrong when creating the task.");
      }

      // Reset the form
      setTaskFormData({
        taskName: "",
        taskAcceptanceCriteria: "",
        taskTimeEstimate: 0,
      });

      // Refresh the page or navigate
      navigate(0);
    } catch (err) {
      console.error(err);
      setAlertMessage(err.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      {/* Show alert if an error occurs */}
      {showAlert && (
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger">
          {alertMessage}
        </Alert>
      )}

      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Task name input */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="taskName">Task Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Task X.1.1"
            name="taskName"
            onChange={handleInputChange}
            value={taskFormData.taskName}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add a name for your task.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Task acceptance criteria input */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="taskAcceptanceCriteria">Acceptance Criteria</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="GIVEN... WHEN... THEN..."
            name="taskAcceptanceCriteria"
            onChange={handleInputChange}
            value={taskFormData.taskAcceptanceCriteria}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please add acceptance criteria for your task.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Task time estimate input */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="taskTimeEstimate">Time Estimate (h)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Estimated time to complete task"
            name="taskTimeEstimate"
            min="0"
            step="0.1"
            onChange={handleInputChange}
            value={taskFormData.taskTimeEstimate}
            required
          />
          <Form.Text muted>
            Must be written in hours (decimal format), e.g., 10.5 for 10 hours and 30 minutes.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please add a time estimate.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" variant="success">
          Create Task
        </Button>
      </Form>
    </>
  );
};

export default TaskForm;
