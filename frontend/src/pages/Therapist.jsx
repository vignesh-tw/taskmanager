import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import TherapistCard from "../components/TherapistCard";

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load all therapists on component mount
  useEffect(() => {
    loadAllTherapists();
  }, []);

  const loadAllTherapists = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/therapists");
      const therapistData = response.data.data || [];
      setTherapists(Array.isArray(therapistData) ? therapistData : []);
    } catch (err) {
      console.error("Error loading therapists:", err);
      setError("Failed to load therapists");
      setTherapists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get("/api/therapists", {
        params: searchParams,
      });
      const results = response.data.data || [];
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedTherapists = hasSearched ? searchResults : therapists;

  return (
    <div className="py-4" style={{ marginTop: "70px" }}>
      <Container fluid style={{ maxWidth: "1400px" }}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-4 fw-bold mb-3">Find Your Therapist</h1>
          <p className="lead text-muted mb-4">
            Browse and search through our network of qualified mental health
            professionals
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 search-bar-container">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Results Header */}
        {hasSearched && (
          <div className="mb-3">
            <h3 className="mb-2">
              {loading
                ? "Searching..."
                : displayedTherapists.length > 0
                  ? `Found ${displayedTherapists.length} therapist${displayedTherapists.length !== 1 ? "s" : ""}`
                  : "No therapists found"}
            </h3>
            {displayedTherapists.length === 0 && !loading && (
              <p className="text-muted">
                Try adjusting your search criteria or browse all available
                therapists.
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {/* Therapist Grid */}
        {!loading && (
          <Row className="g-4">
            {displayedTherapists.map((therapist) => (
              <Col
                xs={12}
                sm={6}
                lg={4}
                xl={3}
                className="therapist-card-wrapper"
                key={therapist.id}
              >
                <TherapistCard therapist={therapist} />
              </Col>
            ))}
          </Row>
        )}

        {/* Empty State */}
        {!loading && displayedTherapists.length === 0 && !hasSearched && (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">
              No therapists available at the moment
            </h4>
            <p className="text-muted">
              Please check back later or contact support for assistance.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
