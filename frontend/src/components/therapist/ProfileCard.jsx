import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import { Edit, PhotoCamera, Verified } from '@mui/icons-material';

const ProfileCard = ({ profile, onEdit, onPhotoSelect, previewUrl }) => {
  return (
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
            {profile.name?.charAt(0).toUpperCase()}
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
            <input hidden accept="image/*" type="file" onChange={onPhotoSelect} />
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
          label={\`$\${profile.rate?.amount || 0}/hour\`}
          color="primary"
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={onEdit}
          fullWidth
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;