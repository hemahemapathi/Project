import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { getProject, getFeature, getAllTasks, deleteTask } from "../utils/API";
import Auth from "../utils/auth";

const ProjectTasks = () => {
  const { projectId, featureId } = useParams();

  const [projectData, setProjectData] = useState({});
  const [featureData, setFeatureData] = useState({});
  const [taskData, setTaskData] = useState([]);

  const projectDataLength = Object.keys(projectData).length;
  const featureDataLength = Object.keys(featureData).length;
  const taskDataLength = Object.keys(taskData).length;

  // Get project data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) return;

        const { data } = await getProject(projectId, token);
        setProjectData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjectData();
  }, [projectId, projectDataLength]);

  // Get feature data
  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) return;

        const { data } = await getFeature(projectId, featureId, token);
        setFeatureData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeatureData();
  }, [projectId, featureId, featureDataLength]);

  // Get task data
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) return;

        const { data } = await getAllTasks(projectId, featureId, token);
        setTaskData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTaskData();
  }, [projectId, featureId, taskDataLength]);

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;
      if (!token) return;

      await deleteTask(projectId, featureId, taskId, token);

      // Refetch task data after deletion
      const { data } = await getAllTasks(projectId, featureId, token);
      setTaskData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/myprojects" }}>
          My projects
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/myprojects/${projectId}` }}
        >
          {projectData.projectName}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/myprojects/${projectId}/features` }}
        >
          {featureData.featureName}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add tasks</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex feature justify-content-between align-items-center">
        <h2>Add tasks</h2>
        {taskData.length > 0 ? (
          <Link
            className="btn btn-important"
            variant="success"
            to={`/myprojects/${projectId}`}
          >
            Finish creating project →
          </Link>
        ) : null}
      </div>
      <p>Break down {featureData.featureName} into tasks.</p>
      
      <TaskList
        projectId={projectId}
        featureId={featureId}
        featureMustHave={featureData.featureMustHave}
        tasks={taskData}
        handleDeleteTask={handleDeleteTask}
      />

      <TaskForm projectId={projectId} featureId={featureId} />
      
      <Link to={`/myprojects/${projectId}/features`}>← Back to features</Link>
    </main>
  );
};

export default ProjectTasks;
