import React from "react";
import {
  Box,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const CommonPagination = ({
  count,
  page,
  onChange,
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25],
  disabled = false,
  height = "",
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);
  const handleItemsPerPageChange = (event) => {
    const keyOfAction = "itemsPerPage";
    onChange(1, parseInt(event.target.value), keyOfAction);
  };

  const handlePreviousPage = () => {
    if (page > 1 && !disabled) {
      const keyOfAction = "previous";
      onChange(Number(page) - 1, rowsPerPage, keyOfAction);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages && !disabled) {
      const keyOfAction = "next";
      onChange(Number(page) + 1, rowsPerPage, keyOfAction);
    }
  };
  const startItemIndex = (page - 1) * rowsPerPage + 1;
  const endItemIndex = Math.min(page * rowsPerPage, count);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: height,
      }}
    >
      <div>
        <Typography variant="span">Items per page</Typography>
        <Select
          value={rowsPerPage}
          onChange={handleItemsPerPageChange}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          {rowsPerPageOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </div>

      <Divider
        orientation="vertical"
        flexItem
        style={{ marginBottom: "-4px", border: ".2px solid #C6C6C6" }}
      />
      <div>
        <Typography variant="span" sx={{ marginX: 1 }}>
          {`${startItemIndex} - ${endItemIndex} of ${count} items`}
        </Typography>
      </div>

      <Divider
        orientation="vertical"
        flexItem
        style={{ marginBottom: "-4px", border: ".2px solid #C6C6C6" }}
      />
      <IconButton
        disabled={page === 1 || disabled}
        onClick={handlePreviousPage}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <Divider
        orientation="vertical"
        flexItem
        style={{ marginBottom: "-4px", border: ".2px solid #C6C6C6" }}
      />
      <IconButton
        disabled={page === totalPages || disabled}
        onClick={handleNextPage}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default CommonPagination;
