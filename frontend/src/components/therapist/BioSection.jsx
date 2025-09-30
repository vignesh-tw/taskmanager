import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const BioSection = ({ bio, onEdit }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
        <Typography variant="h6">
          Professional Bio
        </Typography>
        <Button
          startIcon={<Edit />}
          size="small"
          onClick={onEdit}
        >
          Edit Bio
        </Button>
      </Box>
      {bio ? (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {bio}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No bio added yet. Click Edit to add your professional bio.
        </Typography>
      )}
    </Paper>
  );
};

export default BioSection;