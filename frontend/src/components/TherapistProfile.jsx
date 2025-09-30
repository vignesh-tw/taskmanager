import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCalendar from "./BookingCalendar";
import BookingConfirmation from "./BookingConfirmation";

const TherapistProfile = ({ therapistId }) => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (therapistId) {
      fetchTherapistData();
    }
  }, [therapistId]);

  const fetchTherapistData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/therapists/${therapistId}`);
      setTherapist(response.data.data);
    } catch (err) {
      console.error("Error fetching therapist:", err);
      setError("Failed to load therapist profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookSession = () => {
    if (selectedSlot) {
      setShowBookingModal(true);
    }
  };

  const handleBookingSuccess = (bookingData) => {
    // Refresh therapist data to update available slots
    fetchTherapistData();
    setSelectedSlot(null);
    setShowBookingModal(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-current"
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
          className="w-5 h-5 text-yellow-400 fill-current"
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
          className="w-5 h-5 text-gray-300 fill-current"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-lg text-gray-600 mb-2">
            {error || "Therapist not found"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {therapist.profilePicture ? (
              <img
                src={therapist.profilePicture}
                alt={therapist.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {getInitials(therapist.name)}
                </span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {therapist.name}
                </h1>
                <p className="text-lg text-blue-600 font-medium mb-2">
                  {therapist.specialty}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(therapist.rating || 0)}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {therapist.rating ? therapist.rating.toFixed(1) : "0.0"}
                  </span>
                  {therapist.reviewCount > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({therapist.reviewCount} reviews)
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Price */}
              <div className="text-right">
                <div className="mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      therapist.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {therapist.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${therapist.sessionPrice || 100}
                  <span className="text-sm font-normal text-gray-500">
                    /session
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {therapist.experience && (
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{therapist.experience}</span>
                </div>
              )}

              {therapist.location && (
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  </svg>
                  <span>{therapist.location}</span>
                </div>
              )}

              {therapist.languages && therapist.languages.length > 0 && (
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span>{therapist.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", name: "Overview" },
                  { id: "specializations", name: "Specializations" },
                  { id: "education", name: "Education & Credentials" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {therapist.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {therapist.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Approach
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      I believe in creating a safe, non-judgmental space where
                      clients can explore their thoughts and feelings. My
                      therapeutic approach is collaborative, client-centered,
                      and evidence-based.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "specializations" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Areas of Expertise
                  </h3>
                  {therapist.specializations &&
                  therapist.specializations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {therapist.specializations.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-blue-50 rounded-lg"
                        >
                          <svg
                            className="w-5 h-5 text-blue-600 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-800">{spec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-800">
                          {therapist.specialty}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-6">
                  {therapist.education && therapist.education.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {therapist.education.map((edu, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <h4 className="font-medium text-gray-900">
                              {edu.degree || "Degree"}
                            </h4>
                            <p className="text-gray-600">
                              {edu.school || "University"}
                            </p>
                            {edu.year && (
                              <p className="text-sm text-gray-500">
                                {edu.year}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Education
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">
                          Licensed Clinical Therapist
                        </h4>
                        <p className="text-gray-600">
                          Professional certification and training
                        </p>
                      </div>
                    </div>
                  )}

                  {therapist.certifications &&
                    therapist.certifications.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Certifications
                        </h3>
                        <div className="space-y-2">
                          {therapist.certifications.map((cert, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-green-50 rounded-lg"
                            >
                              <svg
                                className="w-5 h-5 text-green-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              </svg>
                              <span className="text-gray-800">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Booking */}
        <div className="space-y-6">
          <BookingCalendar
            therapistId={therapistId}
            onSlotSelect={handleSlotSelect}
            selectedSlot={selectedSlot}
          />

          {/* Book Session Button */}
          {selectedSlot && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Selected Session
                </h4>
                <div className="text-sm text-gray-600">
                  <p>
                    {new Date(selectedSlot.startTime).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p>
                    {new Date(selectedSlot.startTime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBookSession}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Book This Session - $
                {selectedSlot.price || therapist.sessionPrice || 100}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmation
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        therapist={therapist}
        selectedSlot={selectedSlot}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default TherapistProfile;
