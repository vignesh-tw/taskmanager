import React, { useState } from "react";

const SearchBar = ({ onSearch, onFilterChange, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    language: "",
    location: "",
  });

  const specialties = [
    "Cognitive Behavioral Therapy (CBT)",
    "Marriage Counseling",
    "Family Therapy",
    "Anxiety Treatment",
    "Depression Treatment",
    "PTSD Treatment",
    "Addiction Counseling",
    "Child Psychology",
    "Trauma Therapy",
    "Group Therapy",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Mandarin",
    "Japanese",
    "Korean",
    "Arabic",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      search: searchTerm.trim(),
      ...filters,
    });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange({
        search: searchTerm.trim(),
        ...newFilters,
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      specialty: "",
      language: "",
      location: "",
    });
    onSearch({});
  };

  const hasActiveFilters =
    searchTerm || Object.values(filters).some((val) => val);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body p-4">
        <form onSubmit={handleSearch}>
          {/* Main Search Bar */}
          <div className="mb-4">
            <label
              htmlFor="therapist-search"
              className="form-label fw-semibold mb-2"
            >
              Search Therapists
            </label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light border-end-0">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-search text-muted"
                  viewBox="0 0 16 16"
                >
                  <path d="m13.498 12.748a.5.5 0 0 1-.707.707l-3.293-3.293a6.002 6.002 0 1 1 .707-.707l3.293 3.293zM6.5 12A5.5 5.5 0 1 0 6.5 1a5.5 5.5 0 0 0 0 11z" />
                </svg>
              </span>
              <input
                id="therapist-search"
                type="text"
                className="form-control border-start-0"
                placeholder="Enter therapist name, specialty, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "1.1rem" }}
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-4">
            <h6 className="fw-semibold mb-3 text-muted">Filter Options</h6>

            {/* Specialty Filter - Full Width */}
            <div className="mb-3">
              <label
                htmlFor="specialty-filter"
                className="form-label fw-medium mb-2"
              >
                Specialty
              </label>
              <select
                id="specialty-filter"
                value={filters.specialty}
                onChange={(e) =>
                  handleFilterChange("specialty", e.target.value)
                }
                className="form-select form-select-lg"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter - Full Width */}
            <div className="mb-3">
              <label
                htmlFor="language-filter"
                className="form-label fw-medium mb-2"
              >
                Language
              </label>
              <select
                id="language-filter"
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="form-select form-select-lg"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter - Full Width */}
            <div className="mb-4">
              <label
                htmlFor="location-filter"
                className="form-label fw-medium mb-2"
              >
                Location
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-geo-alt text-muted"
                    viewBox="0 0 16 16"
                  >
                    <path d="m12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input
                  id="location-filter"
                  type="text"
                  className="form-control"
                  placeholder="Enter city, state, or zip code"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Search Button - Full Width */}
            <div className="d-grid">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
                style={{ minHeight: "56px", fontSize: "1.1rem" }}
              >
                {loading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Searching Therapists...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-search me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="m13.498 12.748a.5.5 0 0 1-.707.707l-3.293-3.293a6.002 6.002 0 1 1 .707-.707l3.293 3.293zM6.5 12A5.5 5.5 0 1 0 6.5 1a5.5 5.5 0 0 0 0 11z" />
                    </svg>
                    Find Therapists
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
              <small className="text-muted">
                {Object.values(filters).filter((v) => v).length +
                  (searchTerm ? 1 : 0)}{" "}
                filter(s) active
              </small>
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline-secondary btn-sm"
              >
                <svg
                  width="14"
                  height="14"
                  fill="currentColor"
                  className="bi bi-x-circle me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m4.646 4.646.708.708L8 8l2.646-2.646.708.708L8.708 8.5l2.647 2.646-.707.708L8 9.207l-2.646 2.647-.708-.708L7.293 8.5 4.646 5.854z" />
                </svg>
                Clear Filters
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
