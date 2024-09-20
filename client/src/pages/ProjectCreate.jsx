import React from "react";
import axios from "axios"; // Import Axios

// Import bootstrap components
import { Breadcrumb } from "react-bootstrap";

// Import Link component for all internal application hyperlinks
import { Link } from "react-router-dom";

// Import components
import ProjectForm from "../components/ProjectForm";
import Auth from "../utils/auth";

const ProjectCreate = () => {
  // Function to handle form submission
  const handleProjectSubmit = async (formData) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;
      if (!token) return;

      const response = await axios.post('/projects', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Handle success (e.g., redirect to project list or show success message)
        console.log("Project created successfully");
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <main>
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/myprojects" }}>
          My projects
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add project</Breadcrumb.Item>
      </Breadcrumb>
      {/* Page title */}
      <h2>Add project</h2>
      {/* Form for creating project */}
      <ProjectForm onSubmit={handleProjectSubmit} />
    </main>
  );
};

export default ProjectCreate;
