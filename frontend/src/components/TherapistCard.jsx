import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";

const TherapistCard = ({ therapist }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/therapist/${therapist.id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          width="16"
          height="16"
          className="text-warning"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          width="16"
          height="16"
          className="text-warning"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGradient)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          width="16"
          height="16"
          className="text-muted"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>,
      );
    }

    return stars;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="h-100 shadow-sm border-0 cursor-pointer"
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
      onClick={handleCardClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Profile Image/Avatar */}
      <div className="position-relative">
        {therapist.profilePicture ? (
          <Card.Img
            variant="top"
            src={therapist.profilePicture}
            alt={therapist.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              height: "200px",
              background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
              fontSize: "1.5rem",
              fontWeight: "600",
            }}
          >
            {getInitials(therapist.name)}
          </div>
        )}

        {/* Availability Badge */}
        <div className="position-absolute top-0 end-0 p-2">
          <Badge
            bg={therapist.isAvailable ? "success" : "secondary"}
            className="rounded-pill"
          >
            {therapist.isAvailable ? "Available" : "Busy"}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <Card.Body className="d-flex flex-column">
        {/* Name and Title */}
        <div className="mb-3">
          <Card.Title className="h5 mb-1">{therapist.name}</Card.Title>
          <Card.Subtitle className="text-primary fw-medium">
            {therapist.specialty || "General Therapy"}
          </Card.Subtitle>
        </div>

        {/* Rating and Reviews */}
        <div className="d-flex align-items-center mb-3">
          <div className="d-flex align-items-center me-2">
            {renderStars(therapist.rating || 0)}
          </div>
          <small className="text-muted">
            {therapist.rating ? therapist.rating.toFixed(1) : "0.0"}
          </small>
          {therapist.reviewCount > 0 && (
            <small className="text-muted ms-1">
              ({therapist.reviewCount} reviews)
            </small>
          )}
        </div>

        {/* Languages */}
        {therapist.languages && therapist.languages.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {therapist.languages.slice(0, 3).map((language, index) => (
                <Badge
                  key={index}
                  bg="light"
                  text="dark"
                  className="rounded-pill"
                >
                  {language}
                </Badge>
              ))}
              {therapist.languages.length > 3 && (
                <small className="text-muted align-self-center">
                  +{therapist.languages.length - 3} more
                </small>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {therapist.location && (
          <div className="d-flex align-items-center text-muted mb-3">
            <svg
              width="16"
              height="16"
              className="me-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <small className="text-truncate">{therapist.location}</small>
          </div>
        )}

        {/* Bio Preview */}
        {therapist.bio && (
          <Card.Text className="small text-muted mb-4 flex-grow-1">
            {therapist.bio.length > 100
              ? `${therapist.bio.substring(0, 100)}...`
              : therapist.bio}
          </Card.Text>
        )}

        {/* Action Button */}
        <Button
          variant="primary"
          className="w-100 mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Profile & Book Session
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TherapistCard;
