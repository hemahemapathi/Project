import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Auth from "../utils/auth";
import { saveUserId } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate  = useNavigate();

  // Handle input change for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // API call to handle signup
  const handleSignup = async (formData) => {
    try {
      const response = await axios.post('user/signup', formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        const { token, user } = response.data;

        // Save user ID and login token to localStorage
        saveUserId(user._id);
        Auth.login(token);

        console.log('User signed up successfully');
      

        // Close modal on successful signup
        if (handleModalClose) {
          handleModalClose();
        }
        navigate('/login')
        

        // Reset form data after successful submission
        setUserFormData({
          username: "",
          email: "",
          password: "",
        });
        setValidated(false);
      }
    } catch (error) {
      console.error('Error signing up:', error.response.data);
      setErrorMessage("Failed to sign up. Please try again.");
      setShowAlert(true);
    }
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

    // Call the API signup function
    await handleSignup(userFormData);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show alert if API response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          {errorMessage || "Something went wrong with your sign up."}
        </Alert>

        {/* Username input */}
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">Please add a username.</Form.Control.Feedback>
        </Form.Group>

        {/* Email input */}
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Please add a valid email address.</Form.Control.Feedback>
        </Form.Group>

        {/* Password input */}
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Please add a password.</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="success">
          Sign up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
