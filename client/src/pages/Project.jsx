import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { Breadcrumb } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ProjectChart from "../components/ProjectChart";
import Delayed from "../components/Delayed";
import Auth from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const Project = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [rawHourEstimatesData, setRawHourEstimates] = useState({});
  const [modifiedWeekEstimatesData, setModifiedWeekEstimates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjectData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) return;

        const response = await api.get(`/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Something went wrong.");
        }

        const projectData = response.data;
        setProject(projectData);

        const rawHourEstimates = {};
        projectData.features.forEach((feature) => {
          if (feature.featureMustHave) {
            const assignee = feature.featureAssignee.username;
            rawHourEstimates[assignee] = (rawHourEstimates[assignee] || 0) + feature.featureRawTimeEstimate;
          }
        });
        setRawHourEstimates(rawHourEstimates);

        const modifiedWeekEstimates = {};
        projectData.features.forEach((feature) => {
          if (feature.featureMustHave) {
            const assignee = feature.featureAssignee.username;
            const rawTimeEstimate = feature.featureRawTimeEstimate;
            const efficiency = feature.featureAssignee.efficiency;
            const hoursPerWeek = feature.featureAssignee.hoursPerWeek;

            const hours = rawTimeEstimate * efficiency;
            const weeks = hours / hoursPerWeek;
            modifiedWeekEstimates[assignee] = (modifiedWeekEstimates[assignee] || 0) + weeks;
          }
        });
        setModifiedWeekEstimates(modifiedWeekEstimates);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getProjectData();
  }, [projectId]);

  if (loading) {
    return <p>Loading project data...</p>;
  }

  return (
    <main>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/myprojects" }}>
          My projects
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {project.projectName || "Project"}
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex feature justify-content-between align-items-center">
        <h2>{project.projectName}</h2>
        <Link className="btn btn-primary" to={`/myprojects/${projectId}/features`}>
          Edit project
        </Link>
      </div>

      <h3>Description</h3>
      <p>{project.projectDescription}</p>

      <h3>User story</h3>
      <p>{project.projectUserStory}</p>

      <h3>Projection</h3>
      <Delayed>
        <ProjectChart
          projectId={projectId}
          rawHourEstimates={rawHourEstimatesData}
          modifiedWeekEstimates={modifiedWeekEstimatesData}
        />
      </Delayed>

      <br />
      <h3>Numbers not what you need?</h3>
      <p>
        Go back and edit your project. Consider changing features from "must have" 
        to "nice to have", and/or changing the assignees on different features.
      </p>

      <Link className="btn btn-primary" to={`/myprojects/${projectId}/features`}>
        Edit project
      </Link>
    </main>
  );
};

export default Project;
