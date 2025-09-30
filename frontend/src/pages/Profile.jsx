import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Avatar,
  Box,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Save } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

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

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let profileData = { ...form };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);
        const uploadResponse = await axiosInstance.post(
          "/api/users/upload-photo",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        profileData.profilePicture = uploadResponse.data.url;
      }

      const result = await updateProfile(profileData);
      if (result.success) {
        setSuccess("Profile updated successfully");
        setSelectedFile(null);
        setPreviewUrl("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={previewUrl || user.profilePicture}
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: "3rem",
                    }}
                  >
                    {form.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      right: -8,
                      backgroundColor: "background.paper",
                      "&:hover": { backgroundColor: "background.default" },
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileSelect}
                    />
                    <PhotoCamera />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Click the camera icon to change your profile picture
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange("phoneNumber")}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Save />
                  }
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
