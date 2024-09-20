import React from "react";

// Import custom footer styles
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="w-100 mt-auto text-muted p-4">
      <br />
      <br />
      <br />
      <div className="container text-center mb-5">
        <h4>&copy; {new Date().getFullYear()} - Hemapathi</h4>
        <p>
          Made using Mongoose, Express.js, React.js, Node.js and a RESTful API
          on Gadigal Land. To see the source code, click{" "}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer">
            here
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;