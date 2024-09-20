import React from "react";

// Import router components
// eslint-disable-next-line 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import TeamMemberDashboard from "./pages/TeamMemberDashboard.jsx";
import TeamMemberCreate from "./pages/TeamMemberCreate.jsx";
import TeamMemberUpdate from "./pages/TeamMemberUpdate.jsx";
import ProjectDashboard from "./pages/ProjectDashboard.jsx";
import ProjectCreate from "./pages/ProjectCreate.jsx";
import ProjectFeatures from "./pages/ProjectFeatures.jsx";
import ProjectTasks from "./pages/ProjectTasks.jsx";
import Project from "./pages/Project.jsx";
import NoMatch from "./pages/NoMatch.jsx";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myteam" element={<TeamMemberDashboard />} />
        <Route path="/myteam/addteammember" element={<TeamMemberCreate />} />
        <Route path="/myteam/:teamMemberId" element={<TeamMemberUpdate />} />
        <Route path="/myprojects" element={<ProjectDashboard />} />
        <Route path="/myprojects/addproject" element={<ProjectCreate />} />
        <Route path="/myprojects/:projectId" element={<Project />} />
        <Route path="/myprojects/:projectId/features" element={<ProjectFeatures />} />
        <Route path="/myprojects/:projectId/features/:featureId" element={<ProjectTasks />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
