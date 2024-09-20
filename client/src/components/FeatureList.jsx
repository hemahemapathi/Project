import React from "react";
import { Card } from "react-bootstrap";

/**
 * FeatureList component
 * 
 * @param {string} projectId - Project ID
 * @param {array} features - List of features
 * @param {function} handleDeleteFeature - Function to handle feature deletion
 * @returns {JSX.Element} Feature list component
 */
const FeatureList = ({ projectId, features, handleDeleteFeature }) => {
  // If no features, return null
  if (!features.length) return null;

  return (
    <div>
      {features.map((feature) => (
        <FeatureCard
          key={feature._id}
          feature={feature}
          handleDeleteFeature={handleDeleteFeature}
        />
      ))}
    </div>
  );
};

/**
 * FeatureCard component
 * 
 * @param {object} feature - Feature object
 * @param {function} handleDeleteFeature - Function to handle feature deletion
 * @returns {JSX.Element} Feature card component
 */
const FeatureCard = ({ feature, handleDeleteFeature }) => {
  const className = feature.featureMustHave ? "musthave" : "not-musthave";

  return (
    <Card className={`card mb-3 border-0 ${className}`}>
      <Card.Body className="d-flex feature justify-content-between align-items-center">
        <div className="pl-2">
          <h3>{feature.featureName}</h3>
          {/* Add other feature details here */}
        </div>
        {/* Add delete button or other actions here */}
      </Card.Body>
    </Card>
  );
};

export default FeatureList;