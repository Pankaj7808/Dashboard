import { RestartAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Personalized from "./Personalized";
import { useState } from "react";

const Action = ({
  chartData,
  setFilteredData,
  setSearchTerm,
  checkedWidgets,
  setCheckedWidgets,
}) => {
  const [open, setOpen] = useState(false);

  // Function to toggle the Drawer
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Function to reset personalization, filters, and search term
  const resetPersonalization = () => {
    setFilteredData(chartData);
    setSearchTerm("");

    // Resetting all widgets to checked state
    const resetCheckedWidgets = {};
    Object.entries(chartData).forEach(([_, widgets]) => {
      Object.keys(widgets).forEach((widgetTitle) => {
        resetCheckedWidgets[widgetTitle] = true;
      });
    });
    setCheckedWidgets(resetCheckedWidgets);
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Typography variant="h4">Dashboard</Typography>
      <Box display="flex" flexDirection="row" gap={3}>
        <Button onClick={toggleDrawer(true)} variant="outlined">
          Add Widget
        </Button>
        <Drawer open={open} anchor="right" onClose={toggleDrawer(false)}>
          <Personalized
            chartData={chartData}
            setFilteredData={setFilteredData}
            setOpen={setOpen}
            setCheckedWidgets={setCheckedWidgets}
            checkedWidgets={checkedWidgets}
          />
        </Drawer>
        <Box
          sx={{
            border: "1px solid #333",
            borderRadius: "5px",
            width: "fit-content",
          }}
        >
          <Tooltip title="Reset Personalization">
            <IconButton onClick={resetPersonalization} color="primary">
              <RestartAlt />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default Action;
