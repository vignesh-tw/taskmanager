import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import {
  Schedule,
  Security,
  SearchRounded,
  StarRounded,
  CheckCircleRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import TherapistCard from "../components/TherapistCard";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch initial therapists on load
  useEffect(() => {
    fetchInitialTherapists();
  }, []);

  const fetchInitialTherapists = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/therapists");
      const therapistData = response.data.data || [];
      setTherapists(therapistData.slice(0, 6)); // Show first 6 therapists
    } catch (error) {
      console.error("Error fetching initial therapists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get("/api/therapists", {
        params: searchParams,
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <SearchRounded sx={{ fontSize: 48, color: "white" }} />,
      title: "Smart Search & Discovery",
      description:
        "Find the perfect therapist using our advanced search filters by specialty, language, location, and more.",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <Schedule sx={{ fontSize: 48, color: "white" }} />,
      title: "Real-Time Booking",
      description:
        "See live availability and book sessions instantly with our interactive calendar system.",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: <Security sx={{ fontSize: 48, color: "white" }} />,
      title: "Secure & Private",
      description:
        "Your mental health journey is completely confidential with enterprise-grade security.",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: <CheckCircleRounded sx={{ fontSize: 48, color: "white" }} />,
      title: "Verified Professionals",
      description:
        "All therapists are licensed, verified, and committed to providing quality mental healthcare.",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const stats = [
    { number: "500+", label: "Licensed Therapists" },
    { number: "10,000+", label: "Happy Patients" },
    { number: "50+", label: "Specializations" },
    { number: "24/7", label: "Support Available" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Finding the right therapist was so easy with this platform. The search filters helped me find exactly what I needed.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "The booking process is seamless and the therapists are incredibly professional. Highly recommend!",
      avatar: "MC",
    },
    {
      name: "Emma Rodriguez",
      rating: 5,
      text: "This platform made therapy accessible and convenient. The quality of care has been exceptional.",
      avatar: "ER",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero-section position-relative overflow-hidden text-white w-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          marginTop: "5px" /* Minimal space between navbar and hero */,
        }}
      >
        {/* Background decoration */}
        <div
          className="position-absolute"
          style={{
            top: "-50%",
            right: "-10%",
            width: "60%",
            height: "200%",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            transform: "rotate(-15deg)",
            zIndex: 0,
          }}
        />

        <div
          className="container position-relative"
          style={{ zIndex: 1, maxWidth: "1400px" }}
        >
          <Row className="align-items-center g-5">
            <Col xs={12} lg={7} xl={6}>
              <h1
                className="display-1 fw-bold mb-4 lh-1"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Your Mental Health Journey Starts Here
              </h1>
              <p
                className="lead mb-4"
                style={{ opacity: 0.9, fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
              >
                Connect with licensed therapists, book sessions instantly, and
                take control of your wellbeing with our comprehensive mental
                health platform.
              </p>

              <Row className="text-center mb-5 g-3">
                {stats.map((stat, index) => (
                  <Col xs={6} sm={3} key={index}>
                    <h3 className="fw-bold mb-1">{stat.number}</h3>
                    <small style={{ opacity: 0.8 }}>{stat.label}</small>
                  </Col>
                ))}
              </Row>

              <div className="d-flex gap-3 flex-wrap">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => navigate("/therapists")}
                      className="fw-bold px-4 py-2 d-flex align-items-center gap-2"
                    >
                      <SearchRounded /> Find Therapists
                    </Button>
                    <Button
                      variant="outline-light"
                      size="lg"
                      onClick={() => navigate("/signup")}
                      className="px-4 py-2"
                    >
                      Get Started Free
                    </Button>
                  </>
                ) : (
                  <div>
                    <h5 className="mb-3">Welcome back, {user.name}! 👋</h5>
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() =>
                        navigate(
                          user.userType === "therapist"
                            ? "/therapist/dashboard"
                            : "/therapists",
                        )
                      }
                      className="fw-bold px-4 py-2 d-flex align-items-center gap-2"
                    >
                      <ArrowForwardRounded />
                      {user.userType === "therapist"
                        ? "Go to Dashboard"
                        : "Find Therapists"}
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            <Col xs={12} lg={5} xl={6}>
              <div className="d-flex justify-content-center justify-content-lg-end">
                <Card
                  className="border-0 shadow-lg"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    maxWidth: "600px",
                    width: "100%",
                  }}
                >
                  <Card.Body className="p-5">
                    <h4
                      className="fw-bold mb-4 text-white"
                      style={{ fontSize: "1.5rem" }}
                    >
                      Quick Search
                    </h4>
                    <SearchBar onSearch={handleSearch} loading={loading} />
                    <div className="mt-3">
                      <small className="text-white-50 d-block mb-2">
                        Popular specialties:
                      </small>
                      <div className="d-flex gap-3 flex-wrap">
                        {[
                          "Anxiety",
                          "Depression",
                          "CBT",
                          "Couples Therapy",
                        ].map((specialty) => (
                          <Badge
                            key={specialty}
                            bg="light"
                            text="dark"
                            className="cursor-pointer px-3 py-2"
                            style={{
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              background: "rgba(255,255,255,0.2) !important",
                              color: "white !important",
                              border: "1px solid rgba(255,255,255,0.3)",
                            }}
                            onClick={() =>
                              handleSearch({ specialization: specialty })
                            }
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <div className="container-fluid">
        <div className="container py-5" style={{ maxWidth: "1400px" }}>
          {/* Features Section */}
          <section className="mb-5">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-3">
                Why Choose Our Platform?
              </h2>
              <p
                className="lead text-muted mx-auto"
                style={{ maxWidth: "600px" }}
              >
                We make mental health care accessible, secure, and personalized
                for everyone
              </p>
            </div>

            <Row className="g-4 justify-content-center">
              {features.map((feature, index) => (
                <Col
                  xs={12}
                  sm={6}
                  lg={3}
                  xl={3}
                  xxl={2}
                  key={index}
                  className="d-flex"
                >
                  <Card
                    className="w-100 border-0 text-white text-center shadow-sm feature-card"
                    style={{
                      background: feature.color,
                      borderRadius: "1rem",
                      transition: "transform 0.3s ease",
                      minHeight: "280px",
                    }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center p-4">
                      <div className="mb-3">{feature.icon}</div>
                      <h5 className="fw-bold mb-3">{feature.title}</h5>
                      <p
                        className="mb-0 flex-grow-1 d-flex align-items-center"
                        style={{ opacity: 0.9 }}
                      >
                        {feature.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Featured Therapists Section */}
          <section className="mb-5">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-3">
                {hasSearched
                  ? "Search Results"
                  : "Meet Our Featured Therapists"}
              </h2>
              <p className="lead text-muted">
                {hasSearched
                  ? `Found ${searchResults.length} therapist${searchResults.length !== 1 ? "s" : ""} matching your criteria`
                  : "Experienced professionals ready to support your mental health journey"}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  variant="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
              </div>
            ) : (
              <>
                <Row className="g-4 justify-content-center">
                  {(hasSearched ? searchResults : therapists).map(
                    (therapist) => (
                      <Col
                        xs={12}
                        sm={6}
                        lg={4}
                        xl={4}
                        xxl={3}
                        key={therapist.id}
                        className="d-flex"
                      >
                        <div className="w-100">
                          <TherapistCard therapist={therapist} />
                        </div>
                      </Col>
                    ),
                  )}
                </Row>

                {!hasSearched && therapists.length > 0 && (
                  <div className="text-center mt-5">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={() => navigate("/therapists")}
                      className="px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                    >
                      <ArrowForwardRounded /> View All Therapists
                    </Button>
                  </div>
                )}

                {hasSearched && searchResults.length === 0 && (
                  <div className="text-center py-5">
                    <h5 className="text-muted mb-3">
                      No therapists found matching your criteria
                    </h5>
                    <p className="text-muted mb-4">
                      Try adjusting your search filters or browse all available
                      therapists.
                    </p>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setHasSearched(false);
                          setSearchResults([]);
                        }}
                      >
                        Clear Search
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate("/therapists")}
                      >
                        Browse All
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Testimonials Section */}
          <section className="py-5 bg-light rounded-4 mb-5">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-3">What Our Users Say</h2>
              <p className="lead text-muted">
                Real stories from people who found the help they needed
              </p>
            </div>

            <Row className="g-4 justify-content-center">
              {testimonials.map((testimonial, index) => (
                <Col
                  xs={12}
                  md={6}
                  lg={4}
                  xl={4}
                  xxl={3}
                  key={index}
                  className="d-flex"
                >
                  <Card className="w-100 border shadow-sm">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                          <div className="d-flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <StarRounded
                                key={i}
                                className="text-warning"
                                style={{ fontSize: "18px" }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="fst-italic text-muted mb-0 flex-grow-1">
                        "{testimonial.text}"
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* CTA Section */}
          {!isAuthenticated && (
            <section
              className="text-center py-5 text-white rounded-4 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div
                className="position-absolute"
                style={{
                  top: "-20%",
                  left: "-10%",
                  width: "40%",
                  height: "140%",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "50%",
                  transform: "rotate(15deg)",
                  zIndex: 0,
                }}
              />
              <div className="position-relative" style={{ zIndex: 1 }}>
                <h2 className="display-4 fw-bold mb-3">
                  Ready to Start Your Journey?
                </h2>
                <p
                  className="lead mb-4 mx-auto"
                  style={{ opacity: 0.9, maxWidth: "600px" }}
                >
                  Join thousands of users who have transformed their mental
                  health with our platform
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    variant="light"
                    size="lg"
                    onClick={() => navigate("/therapists")}
                    className="fw-bold px-4 py-2 d-flex align-items-center gap-2"
                  >
                    <ArrowForwardRounded /> Find Your Therapist
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
