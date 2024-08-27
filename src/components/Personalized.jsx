import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Personalized = ({
  chartData,
  setFilteredData,
  setOpen,
  setCheckedWidgets,
  checkedWidgets,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCheckboxChange = (widgetName) => (event) => {
    setCheckedWidgets((prev) => ({
      ...prev,
      [widgetName]: event.target.checked,
    }));
  };

  const handleConfirm = () => {
    const updatedData = { ...chartData };

    Object.keys(chartData).forEach((dashboardTitle) => {
      updatedData[dashboardTitle] = Object.entries(chartData[dashboardTitle])
        .filter(([widgetTitle]) => checkedWidgets[widgetTitle])
        .reduce((acc, [widgetTitle, widgetData]) => {
          acc[widgetTitle] = widgetData;
          return acc;
        }, {});
    });

    setFilteredData(updatedData);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Get the current dashboard title
  const currentDashboardTitle = Object.keys(chartData)[value];
  const widgets = currentDashboardTitle ? chartData[currentDashboardTitle] : {};

  return (
    <Card sx={{ width: 600, height: "100%" }}>
      <CardHeader
        title={
          <Box>
            <Typography variant="h5">Personalized Widgets</Typography>
            <Typography variant="body2">(To Hide or show widgets)</Typography>
          </Box>
        }
        action={
          <IconButton onClick={handleCancel} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        }
        sx={{ backgroundColor: "primary.main", color: "white" }}
      />

      <CardContent>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="carousel tabs"
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: "1px solid #ccc", mb: 2 }}
        >
          {Object.entries(chartData).map(([dashboardTitle], index) => (
            <Tab key={index} label={dashboardTitle} />
          ))}
        </Tabs>

        {/* Content corresponding to each tab */}
        <Box sx={{ padding: 1 }}>
          {Object.entries(widgets).length > 0 ? (
            Object.entries(widgets).map(([widgetTitle, _], index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #333",
                  padding: 1,
                  marginBottom: 1,
                  borderRadius: "5px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkedWidgets[widgetTitle]}
                      onChange={handleCheckboxChange(widgetTitle)}
                    />
                  }
                  label={widgetTitle}
                />
              </Box>
            ))
          ) : (
            <Typography variant="subtitle2">
              No widgets Available. Please add widgets to personalize.
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Box
          flexDirection="row"
          width="100%"
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default Personalized;
