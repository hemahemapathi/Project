import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";
import "../styles/Nav.css";

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar className="nav mb-4" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand className="brandName" as={Link} to="/">
            <h1 className="un">Pro</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link className="un px-4" as={Link} to="/myteam">
                    My team
                  </Nav.Link>
                  <Nav.Link className="un px-4" as={Link} to="/myprojects">
                    My projects
                  </Nav.Link>
                  <Nav.Link className="un px-4" onClick={Auth.logout}>
                    Log out
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="un px-4"
                  onClick={() => setShowModal(true)}
                >
                  Log in or Sign up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Log in</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;