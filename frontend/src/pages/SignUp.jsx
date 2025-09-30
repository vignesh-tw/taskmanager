import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Enhanced schema: ensure patient path does not fail due to empty implicit numeric fields
const signUpSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
  userType: yup.string().oneOf(['patient', 'therapist'], 'Please select a valid user type').required('User type is required'),
  specialties: yup.array().when('userType', {
    is: 'therapist',
    then: (schema) => schema.min(1, 'Please select at least one specialty'),
    otherwise: (schema) => schema.transform(() => []).notRequired().strip(),
  }),
  rate: yup.mixed().when('userType', {
    is: 'therapist',
    then: () =>
      yup
        .number()
        .typeError('Rate must be a number')
        .min(0, 'Rate must be non-negative')
        .required('Rate is required'),
    otherwise: () =>
      yup
        .mixed()
        .transform(() => undefined) // Strip out for patient so it never blocks
        .notRequired()
        .strip(),
  }),
});

const therapistSpecialties = [
  'Anxiety',
  'Depression',
  'Relationship Counseling',
  'Family Therapy',
  'Cognitive Behavioral Therapy',
  'Trauma Therapy',
  'Addiction Counseling',
  'Child Psychology',
  'Couples Therapy',
  'Grief Counseling'
];

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
      specialties: [],
      rate: ''
    }
  });

  const userType = watch('userType');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Prepare data based on user type
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        userType: data.userType
      };

      if (data.userType === 'therapist') {
        userData.specialties = data.specialties;
        userData.rate = {
          amount: parseFloat(data.rate),
          currency: 'USD'
        };
      }

      console.log('[SignUp] submitting', { ...userData, password: '***' });
      const result = await register(userData);
      console.log('[SignUp] result', result);

      if (result.success) {
        if (result.data.userType === 'therapist') {
          navigate('/therapist/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (e) {
      console.error('[SignUp] unexpected error', e);
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validation error handler to surface first error when submission blocked
  const onValidationError = (errs) => {
    console.log('[SignUp] validation errors', errs);
    const first = Object.values(errs)[0];
    if (first?.message) setError(first.message);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit, onValidationError)} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoComplete="name"
                    autoFocus
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="userType"
                control={control}
                render={({ field }) => (
                  <FormControl margin="normal" required fullWidth error={!!errors.userType}>
                    <InputLabel id="userType-label">I am a</InputLabel>
                    <Select
                      {...field}
                      labelId="userType-label"
                      id="userType"
                      label="I am a"
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="therapist">Therapist</MenuItem>
                    </Select>
                    <FormHelperText>{errors.userType?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Therapist-specific fields */}
            {userType === 'therapist' && (
              <>
                <Controller
                  name="specialties"
                  control={control}
                  render={({ field }) => (
                    <FormControl margin="normal" required fullWidth error={!!errors.specialties}>
                      <InputLabel id="specialties-label">Specialties</InputLabel>
                      <Select
                        {...field}
                        labelId="specialties-label"
                        multiple
                        label="Specialties"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {therapistSpecialties.map((specialty) => (
                          <MenuItem key={specialty} value={specialty}>
                            {specialty}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.specialties?.message}</FormHelperText>
                    </FormControl>
                  )}
                />

                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="rate"
                      label="Hourly Rate (USD)"
                      type="number"
                      error={!!errors.rate}
                      helperText={errors.rate?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/login"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;