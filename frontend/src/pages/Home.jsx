import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container
} from '@mui/material';
import {
  Psychology,
  Schedule,
  Security,
  Group
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Find Qualified Therapists',
      description: 'Browse through our network of verified and experienced mental health professionals.'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy Scheduling',
      description: 'Book appointments that fit your schedule with our simple booking system.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Confidential',
      description: 'Your privacy and security are our top priorities. All data is encrypted and protected.'
    },
    {
      icon: <Group sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Community Support',
      description: 'Join a supportive community focused on mental health and wellbeing.'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Mental Health Care Made Simple
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          Connect with qualified therapists and take control of your mental wellness journey
        </Typography>
        
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                },
                px: 4,
                py: 1.5
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/therapists')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'grey.100',
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                px: 4,
                py: 1.5
              }}
            >
              Browse Therapists
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Welcome back, {user.name}!
            </Typography>
            {user.userType === 'therapist' ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/therapist/dashboard')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/therapists')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                Find Therapists
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Why Choose Our Platform?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          We make mental health care accessible, secure, and personalized for everyone
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            bgcolor: 'grey.50',
            borderRadius: 2,
            mb: 4
          }}
        >
          <Typography
            component="h3"
            variant="h4"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Join thousands of users who have found the support they need
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5 }}
            >
              Sign Up as Patient
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5 }}
            >
              Join as Therapist
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Home;