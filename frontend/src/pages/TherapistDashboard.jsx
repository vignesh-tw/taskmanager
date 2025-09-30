import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Edit,
  Psychology,
  Schedule,
  Group,
  Star,
  Add,
  Delete,
  Verified
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TherapistDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const specialtyOptions = [
    'Anxiety', 'Depression', 'Relationship Counseling', 'Family Therapy',
    'Cognitive Behavioral Therapy', 'Trauma Therapy', 'Addiction Counseling',
    'Child Psychology', 'Couples Therapy', 'Grief Counseling'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/therapists/me/profile');
      setProfile(response.data);
      setEditForm(response.data);
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setProfile(result.data);
        setEditDialogOpen(false);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Therapist Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your profile and track your practice
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {profile.name}
                </Typography>
                {profile.isVerified && (
                  <Verified sx={{ ml: 1, color: 'success.main' }} />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>
              
              <Chip
                label={`$${profile.rate}/hour`}
                color="primary"
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditDialogOpen(true)}
                fullWidth
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Bio */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Professional Bio
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profile.bio || 'No bio added yet. Click Edit Profile to add your professional background.'}
                </Typography>
              </Paper>
            </Grid>

            {/* Specialties */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Specialties
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.specialties && profile.specialties.length > 0 ? (
                    profile.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        color="secondary"
                        size="small"
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No specialties added
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Languages */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Languages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.languages && profile.languages.length > 0 ? (
                    profile.languages.map((language, index) => (
                      <Chip
                        key={index}
                        label={language}
                        variant="outlined"
                        size="small"
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No languages added
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Experience & Qualifications */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Experience & Qualifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Years of Experience
                    </Typography>
                    <Typography variant="h6">
                      {profile.experience || 0} years
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Qualifications
                    </Typography>
                    {profile.qualifications && profile.qualifications.length > 0 ? (
                      profile.qualifications.map((qual, index) => (
                        <Typography key={index} variant="body2">
                          • {qual.degree} - {qual.institution} ({qual.year})
                        </Typography>
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        No qualifications added
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Psychology sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">Profile Views</Typography>
                <Typography variant="h4" color="primary">
                  {Math.floor(Math.random() * 100) + 50}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Schedule sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6">Appointments</Typography>
                <Typography variant="h4" color="secondary">
                  {Math.floor(Math.random() * 20) + 5}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Group sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6">Total Patients</Typography>
                <Typography variant="h4" color="success.main">
                  {Math.floor(Math.random() * 50) + 10}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6">Rating</Typography>
                <Typography variant="h4" color="warning.main">
                  {(Math.random() * 1.5 + 3.5).toFixed(1)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hourly Rate ($)"
                  type="number"
                  value={editForm.rate || ''}
                  onChange={(e) => handleFormChange('rate', parseFloat(e.target.value))}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Bio"
                  multiline
                  rows={4}
                  value={editForm.bio || ''}
                  onChange={(e) => handleFormChange('bio', e.target.value)}
                  margin="normal"
                  placeholder="Tell potential clients about your background and approach..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Specialties</InputLabel>
                  <Select
                    multiple
                    value={editForm.specialties || []}
                    onChange={(e) => handleFormChange('specialties', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {specialtyOptions.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Languages</InputLabel>
                  <Select
                    multiple
                    value={editForm.languages || []}
                    onChange={(e) => handleFormChange('languages', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Years of Experience"
                  type="number"
                  value={editForm.experience || ''}
                  onChange={(e) => handleFormChange('experience', parseInt(e.target.value))}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditProfile} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistDashboard;