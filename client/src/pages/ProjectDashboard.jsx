import React, { useState, useEffect } from "react";
import { Row, Col, Card, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { getAllManagersProjects } from "../utils/API";

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllManagersProjects(token);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!Auth.loggedIn()) return <h2>Please log in to view your projects.</h2>;

  return (
    <main>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>My projects</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex align-items-center">
        <h2>My projects</h2>
        <Link className="btn-create" to="/myprojects/addproject">+</Link>
      </div>
      
      <p>{projects.length ? `You have ${projects.length} project${projects.length !== 1 ? 's' : ''}:` : "Please add your first project to get started!"}</p>

      <Row xs={1} md={3} xl={5} className="g-4">
        {projects.map((item) => (
          <Col key={item._id}>
            <Card className="card project border-0 h-100 d-flex text-center">
              <Link to={`/myprojects/${item._id}`} className="parent-hover">
                <Card.Body>
                  <Card.Title>
                    <h3 className="un">{item.projectName}</h3>
                  </Card.Title>
                  <Card.Text className="text">
                    {item.projectDescription}
                  </Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  );
};

export default ProjectDashboard;
