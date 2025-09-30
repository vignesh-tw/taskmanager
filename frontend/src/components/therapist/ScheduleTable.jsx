import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

const ScheduleTable = ({
  schedule,
  onEditSlot,
  onDeleteSlot
}) => {
  const getSlotStatus = (day, time) => {
    const slot = schedule?.find(s => 
      s.day === day && s.time === time
    );
    return slot ? {
      status: slot.status,
      bookingId: slot.bookingId
    } : null;
  };

  const getChipColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'error';
      case 'blocked':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            {daysOfWeek.map((day) => (
              <TableCell key={day} align="center">{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((time) => (
            <TableRow key={time}>
              <TableCell component="th" scope="row">
                {time}
              </TableCell>
              {daysOfWeek.map((day) => {
                const slotInfo = getSlotStatus(day, time);
                return (
                  <TableCell key={`${day}-${time}`} align="center">
                    {slotInfo ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Chip
                          label={slotInfo.status}
                          color={getChipColor(slotInfo.status)}
                          size="small"
                        />
                        <IconButton
                          size="small"
                          onClick={() => onEditSlot(day, time)}
                          disabled={slotInfo.status === 'booked'}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteSlot(day, time)}
                          disabled={slotInfo.status === 'booked'}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => onEditSlot(day, time)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScheduleTable;