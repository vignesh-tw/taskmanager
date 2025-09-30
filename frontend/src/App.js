import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import TherapistDashboard from "./pages/TherapistDashboard";
import Therapist from "./pages/Therapist";
import TherapistProfilePage from "./pages/TherapistProfilePage";
import Slot from "./pages/Slot";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ margin: 0, padding: 0, width: "100%" }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
                    <Login />
                  </Container>
                }
              />
              <Route
                path="/signup"
                element={
                  <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
                    <SignUp />
                  </Container>
                }
              />
              <Route
                path="/therapist/dashboard"
                element={
                  <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <ProtectedRoute requiredRole="therapist">
                      <TherapistDashboard />
                    </ProtectedRoute>
                  </Container>
                }
              />
              <Route path="/therapists" element={<Therapist />} />
              <Route path="/therapist/:id" element={<TherapistProfilePage />} />
              <Route
                path="/slots"
                element={
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Slot />
                  </Container>
                }
              />
              <Route
                path="/bookings"
                element={
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Booking />
                  </Container>
                }
              />
              <Route
                path="/profile"
                element={
                  <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Container>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
