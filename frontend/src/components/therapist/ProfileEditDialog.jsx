import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import { Save, PhotoCamera } from "@mui/icons-material";

const ProfileEditDialog = ({
  open,
  onClose,
  onSave,
  form,
  onChange,
  specialtyOptions,
  languageOptions,
  onPhotoSelect,
  previewUrl,
}) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                margin="normal"
                type="email"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Specialties</InputLabel>
                <Select
                  multiple
                  value={form.specialties || []}
                  onChange={(e) => handleChange("specialties", e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
                  value={form.languages || []}
                  onChange={(e) => handleChange("languages", e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
                value={form.rate?.amount || ""}
                onChange={(e) =>
                  handleChange("rate", {
                    ...form.rate,
                    amount: Number(e.target.value),
                  })
                }
                margin="normal"
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    mx: "auto",
                  }}
                >
                  <Avatar
                    src={previewUrl || form.profilePicture}
                    sx={{
                      width: "100%",
                      height: "100%",
                      fontSize: "4rem",
                    }}
                  >
                    {form.name?.charAt(0).toUpperCase()}
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
                      onChange={onPhotoSelect}
                    />
                    <PhotoCamera />
                  </IconButton>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Professional Bio"
                value={form.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                margin="normal"
                multiline
                rows={4}
                placeholder="Tell us about your experience, approach, and specialties..."
              />

              <TextField
                fullWidth
                label="Years of Experience"
                value={form.experience || ""}
                onChange={(e) =>
                  handleChange("experience", Number(e.target.value))
                }
                margin="normal"
                type="number"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" startIcon={<Save />}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileEditDialog;
