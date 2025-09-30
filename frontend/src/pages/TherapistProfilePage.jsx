import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TherapistProfile from "../components/TherapistProfile";

const TherapistProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate that ID exists
  if (!id) {
    return <Navigate to="/" replace />;
  }

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-vh-100 bg-light">
      <Container fluid className="py-3">
        {/* Back Navigation */}
        <div className="mb-3">
          <Button
            variant="link"
            onClick={handleGoBack}
            className="text-decoration-none text-muted p-0 d-flex align-items-center"
          >
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left me-2"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            Back to search
          </Button>
        </div>

        {/* Therapist Profile Component */}
        <TherapistProfile therapistId={id} />
      </Container>
    </div>
  );
};

export default TherapistProfilePage;
