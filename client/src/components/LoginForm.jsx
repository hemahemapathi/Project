import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios"; // Import axios
import Auth from "../utils/auth";
import { saveUserId } from "../utils/localStorage";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // Added state for dynamic error messages

  // Handle input change for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Check if form is valid
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await axios.post("/user/login", userFormData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Save user ID and login token to localStorage
        saveUserId(user._id);
        Auth.login(token);

        // Reset form data
        setUserFormData({
          username: "",
          password: "",
        });
        setValidated(false); // Reset validation
        setShowAlert(false); // Hide alert on successful login
      } else {
        throw new Error("Login failed with unexpected status code.");
      }
    } catch (err) {
      console.error("Error during login:", err.message);
      setAlertMessage(err.response?.data?.message || "Something went wrong with your log in.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          {alertMessage}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
            autoComplete="username"// Added autocomplete attribute
          />
          <Form.Control.Feedback type="invalid">
            Please enter your username.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
            autoComplete="current-password" // Added autocomplete attribute
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="success">
          Log in
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
