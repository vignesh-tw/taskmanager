import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";

const ChipList = ({
  title,
  items = [],
  variant = "outlined",
  color = "default",
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <Chip key={index} label={item} variant={variant} color={color} />
          ))
        ) : (
          <Typography color="text.secondary">
            No {title.toLowerCase()} added yet
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChipList;
