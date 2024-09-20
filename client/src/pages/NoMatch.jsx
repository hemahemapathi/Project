import React from "react";
import { useLocation, Link } from "react-router-dom"; // Combined imports
import error from "../assets/error.jpg"; // Import your error image

const NotFound = () => {
  const location = useLocation(); // Retrieve the current location from React Router

  return (
    <main className="d-flex justify-content-between align-items-top">
      <div>
        <h2>Oops!</h2>
        
          There doesn't appear to be a page for <b>{location?.pathname}</b>.
       
        <Link className="btn btn-success" to="/">
          Go back to home page
        </Link>
      </div>
      <img src={error} alt="Error" style={{ width: "50%", margin: "auto" }} />
    </main>
  );
};

export default NotFound;     