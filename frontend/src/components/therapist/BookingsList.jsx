import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Divider
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';

const BookingsList = ({
  bookings,
  onAcceptBooking,
  onRejectBooking
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Bookings
      </Typography>
      <List>
        {bookings.length === 0 ? (
          <ListItem>
            <ListItemText primary="No bookings found" />
          </ListItem>
        ) : (
          bookings.map((booking, index) => (
            <React.Fragment key={booking._id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{booking.patientName}</span>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      {formatDateTime(booking.dateTime)}
                      <br />
                      {booking.notes && `Notes: ${booking.notes}`}
                    </>
                  }
                />
                {booking.status === 'pending' && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="success"
                      onClick={() => onAcceptBooking(booking._id)}
                      sx={{ mr: 1 }}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => onRejectBooking(booking._id)}
                    >
                      <Close />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < bookings.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default BookingsList;