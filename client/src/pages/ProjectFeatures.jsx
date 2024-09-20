import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import FeatureList from "../components/FeatureList";
import FeatureForm from "../components/FeatureForm";
import axios from "axios";
import Auth from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const ProjectFeatures = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({});
  const [featureData, setFeatureData] = useState([]);
  const [teamMemberData, setTeamMemberData] = useState([]);

  // Get project data
  useEffect(() => {
    const getProjectData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) return false;
        const response = await api.get(`/projects/${projectId}/teamMembers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectData(response.data);
      } catch (err) {
        console.error("Error fetching project data:", err);
      }
    };

    getProjectData();
  }, [projectId]);

  // Get feature data
  useEffect(() => {
    const getFeatureData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) return false;

        const response = await api.get(`/projects/${projectId}/features`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFeatureData(response.data);
      } catch (err) {
        console.error("Error fetching feature data:", err);
      }
    };

    getFeatureData();
  }, [projectId]);
    // Get team member data
    const [setTeamMemberError] = useState(null);

    useEffect(() => {
      const getTeamMemberData = async () => {
        try {
          const token = Auth.loggedIn() ? Auth.getToken() : null;

          if (!token) return false;

          const response = await api.get(`/projects/${projectId}/teamMembers`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setTeamMemberData(response.data);
          setTeamMemberError(null);
        } catch (err) {
          console.error("Error fetching team member data:", err);
          setTeamMemberError("Unable to fetch team member data. Please try again later.");
          setTeamMemberData([]);
        }
      };

      getTeamMemberData();
    }, [projectId, setTeamMemberError]);
  // Handle delete feature
  const handleDeleteFeature = async (projectId, featureId) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) return false;

      await api.delete(`/features/${featureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Re-fetch feature data after deletion
      const response = await api.get(`/projects/${projectId}/features`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeatureData(response.data);
    } catch (err) {
      console.error("Error deleting feature:", err);
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
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/myprojects/${projectId}` }}>
          {projectData.projectName}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add features</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page title */}
      <div className="d-flex feature justify-content-between align-items-center">
        <h2>Add features</h2>
        {featureData.length >= 1 && featureData[0].tasks && featureData[0].tasks.length >= 1 ? (
          <Link
            className="btn btn-important"
            variant="success"
            to={`/myprojects/${projectId}`}
          >
            Finish creating project →
          </Link>
        ) : null}
      </div>

      <p>Break down {projectData.projectName} into features.</p>

      {/* List displaying features in this project */}
      <FeatureList
        projectId={projectId}
        features={featureData}
        handleDeleteFeature={handleDeleteFeature}
      />

      {/* Form for creating features in this project */}
      <FeatureForm projectId={projectId} teamMembers={teamMemberData} />
    </main>
  );
};

export default ProjectFeatures;