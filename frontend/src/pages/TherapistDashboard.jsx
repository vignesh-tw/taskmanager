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
  Verified,
  PhotoCamera,
  Save
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TherapistDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    // Set mock profile data instead of fetching from API
    const mockProfile = {
      id: '123456',
      name: user?.name || 'Dr. Sarah Johnson',
      email: user?.email || 'sarah.johnson@example.com',
      userType: 'therapist',
      profilePicture: null,
      bio: 'I am a licensed therapist with over 8 years of experience helping individuals and families overcome challenges and improve their mental health. I specialize in cognitive behavioral therapy and have a passion for helping people develop healthy coping strategies.',
      specialties: [
        'Cognitive Behavioral Therapy',
        'Family Therapy',
        'Anxiety Treatment',
        'Depression Counseling'
      ],
      languages: ['English', 'Spanish'],
      rate: {
        amount: 150,
        currency: 'USD'
      },
      experience: 8,
      qualifications: [
        {
          degree: 'Ph.D. in Clinical Psychology',
          institution: 'Stanford University',
          year: '2015'
        },
        {
          degree: 'M.A. in Counseling Psychology',
          institution: 'UC Berkeley',
          year: '2012'
        }
      ],
      isVerified: true,
      availability: {
        monday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
        tuesday: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
        wednesday: ['10:00 AM', '11:00 AM', '3:00 PM'],
        thursday: ['9:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
        friday: ['9:00 AM', '10:00 AM', '11:00 AM'],
        saturday: [],
        sunday: []
      }
    };
    
    setProfile(mockProfile);
    setEditForm(mockProfile);
  }, [user]);

  const handleEditProfile = async () => {
    try {
      // Mock profile update - just update local state
      let profileData = { ...editForm };
      
      if (selectedFile) {
        // Mock file upload - just use the preview URL
        profileData.profilePicture = previewUrl;
      }

      // Simulate API delay
      setTimeout(() => {
        setProfile(profileData);
        setEditDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setError('');
        alert('Profile updated successfully! (Mock update)');
      }, 500);
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
              <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 2 }}>
                <Avatar
                  src={profile.profilePicture || previewUrl}
                  sx={{
                    width: '100%',
                    height: '100%',
                    fontSize: '3rem'
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: 'background.default' }
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                  <PhotoCamera />
                </IconButton>
              </Box>
              
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
                label={`$${profile.rate?.amount || 0}/hour`}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6">
                    Professional Bio
                  </Typography>
                  <Button
                    startIcon={<Edit />}
                    size="small"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit Bio
                  </Button>
                </Box>
                {profile.bio ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.bio}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No bio added yet. Click Edit to add your professional bio.
                  </Typography>
                )}
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
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Email"
                  value={editForm.email || ''}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  margin="normal"
                  type="email"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Specialties</InputLabel>
                  <Select
                    multiple
                    value={editForm.specialties || []}
                    onChange={(e) => handleFormChange('specialties', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
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

                <FormControl fullWidth margin="normal">
                  <InputLabel>Languages</InputLabel>
                  <Select
                    multiple
                    value={editForm.languages || []}
                    onChange={(e) => handleFormChange('languages', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
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

                <TextField
                  fullWidth
                  label="Hourly Rate (USD)"
                  value={editForm.rate?.amount || ''}
                  onChange={(e) => handleFormChange('rate', { ...editForm.rate, amount: Number(e.target.value) })}
                  margin="normal"
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto' }}>
                    <Avatar
                      src={previewUrl || editForm.profilePicture}
                      sx={{
                        width: '100%',
                        height: '100%',
                        fontSize: '4rem'
                      }}
                    >
                      {editForm.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                        backgroundColor: 'background.paper',
                        '&:hover': { backgroundColor: 'background.default' }
                      }}
                    >
                      <input hidden accept="image/*" type="file" onChange={handleFileSelect} />
                      <PhotoCamera />
                    </IconButton>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Professional Bio"
                  value={editForm.bio || ''}
                  onChange={(e) => handleFormChange('bio', e.target.value)}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Tell us about your experience, approach, and specialties..."
                />

                <TextField
                  fullWidth
                  label="Years of Experience"
                  value={editForm.experience || ''}
                  onChange={(e) => handleFormChange('experience', Number(e.target.value))}
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditProfile} variant="contained" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistDashboard;