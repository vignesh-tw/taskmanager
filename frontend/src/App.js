import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TherapistDashboard from './pages/TherapistDashboard';
import Therapist from './pages/Therapist';
import Slot from './pages/Slot';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                  path="/therapist/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="therapist">
                      <TherapistDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/therapists" element={<Therapist />} />
                <Route path="/slots" element={<Slot />} />
                <Route path="/bookings" element={<Booking />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Container>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

