/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Box, Button, Card, Grid, IconButton, Typography } from "@mui/material";
import { Add, CloseOutlined, Error } from "@mui/icons-material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import Chart from "./Chart";
import WidgetForm from "./WidgetForm";
import Action from "./Action";
import Navbar from "./Navbar";

// Utility function to transform an array of fields to an object
const transformNewFields = (fields) => {
  return fields.reduce((acc, { factor, value }) => {
    acc[factor] = value;
    return acc;
  }, {});
};

// Utility function to convert object to chart data format
const transformToChartData = (data) => {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
};

// Utility function to calculate the total value from chart data
const getTotal = (data) => {
  return data.reduce((acc, item) => {
    const value = parseFloat(item.value) || 0;
    return acc + value;
  }, 0);
};

// Function to handle dialog close
const handleClose = (setOpen) => {
  setOpen(false);
};

const Widget = () => {
  const [chartData, setChartData] = useState({});
  const [open, setOpen] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedWidgets, setCheckedWidgets] = useState({});
  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    // Fetching chart data from widgets.json
    const fetchChartData = async () => {
      console.log("WHY CALLED");
      try {
        const response = await fetch("/widgets.json");
        const data = await response.json();
        setChartData(data);

        // Initialize checkedWidgets
        const initialCheckedWidgets = {};
        Object.values(data).forEach((widgets) => {
          Object.keys(widgets).forEach((widgetTitle) => {
            initialCheckedWidgets[widgetTitle] = true;
          });
        });
        setCheckedWidgets(initialCheckedWidgets);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  // Automatically update filteredData whenever chartData
  useEffect(() => {
    const updateFilteredData = () => {
      const updatedFilteredData = Object.keys(chartData).reduce(
        (result, dashboardTitle) => {
          const dashboardData = chartData[dashboardTitle];
          const filteredWidgets = Object.keys(dashboardData).filter(
            (widgetTitle) => checkedWidgets[widgetTitle]
          );

          if (filteredWidgets.length > 0) {
            result[dashboardTitle] = filteredWidgets.reduce(
              (res, widgetTitle) => {
                res[widgetTitle] = dashboardData[widgetTitle];
                return res;
              },
              {}
            );
          } else {
            result[dashboardTitle] = {};
          }
          return result;
        },
        {}
      );
      setFilteredData(updatedFilteredData);
    };

    updateFilteredData();
  }, [chartData]);

  const handleAddChartData = (dashboardTitle, newWidgetName, newFields) => {
    const transformedFields = transformNewFields(newFields);
    setChartData((prevChartData) => ({
      ...prevChartData,
      [dashboardTitle]: {
        ...prevChartData[dashboardTitle],
        [newWidgetName]: transformedFields,
      },
    }));
    setCheckedWidgets((prevCheckedWidgets) => ({
      ...prevCheckedWidgets,
      [newWidgetName]: true,
    }));
  };

  const handleDeleteChartData = (dashboardTitle, title) => {
    setChartData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[dashboardTitle]) {
        delete updatedData[dashboardTitle][title];
      }
      return updatedData;
    });

    setCheckedWidgets((prevCheckedWidgets) => {
      const updatedCheckedWidgets = { ...prevCheckedWidgets };
      delete updatedCheckedWidgets[title];
      return updatedCheckedWidgets;
    });
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData(chartData);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = Object.keys(chartData).reduce(
        (result, dashboardTitle) => {
          const dashboardData = chartData[dashboardTitle];
          const filteredWidgets = Object.keys(dashboardData).filter(
            (widgetTitle) => widgetTitle.toLowerCase().includes(lowercasedTerm)
          );
          if (filteredWidgets.length > 0) {
            result[dashboardTitle] = filteredWidgets.reduce(
              (res, widgetTitle) => {
                if (checkedWidgets[widgetTitle]) {
                  res[widgetTitle] = dashboardData[widgetTitle];
                }
                return res;
              },
              {}
            );
          }
          return result;
        },
        {}
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Grid container spacing={4} style={{ padding: "32px" }}>
        <Grid item xs={12}>
          <Action
            chartData={chartData}
            setSearchTerm={setSearchTerm}
            checkedWidgets={checkedWidgets}
            setCheckedWidgets={setCheckedWidgets}
            setFilteredData={setFilteredData}
          />
        </Grid>

        {Object.entries(filteredData).length > 0 ? (
          Object.entries(filteredData).map(
            ([dashboardTitle, dashboardData], index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="h5" gutterBottom>
                  {dashboardTitle}
                </Typography>
                <Grid container spacing={4}>
                  {Object.entries(dashboardData).map(([title, data], index) => {
                    const transformedData = transformToChartData(data);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          className="widget-card"
                          style={{ height: "200px" }}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            pl={2}
                          >
                            <Typography variant="h6">{title}</Typography>
                            <IconButton
                              sx={{
                                visibility: "hidden",
                                ".widget-card:hover &": {
                                  visibility: "visible",
                                },
                              }}
                              onClick={() =>
                                handleDeleteChartData(dashboardTitle, title)
                              }
                            >
                              <CloseOutlined />
                            </IconButton>
                          </Box>
                          <Box
                            style={{ height: "200px" }}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {transformedData.length === 0 ? (
                              <Box display="flex" flexDirection="row" gap={3}>
                                <DataUsageIcon />
                                <Typography variant="subtitle2">
                                  No Data Available
                                </Typography>
                              </Box>
                            ) : (
                              <Box width="100%">
                                <Chart
                                  data={transformedData}
                                  total={getTotal(transformedData)}
                                />
                              </Box>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      style={{
                        height: "200px",
                        maxWidth: "100%",
                      }}
                    >
                      <Box
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setOpen(true);
                            setWidgetTitle(dashboardTitle);
                          }}
                          startIcon={<Add />}
                        >
                          Add Widget
                        </Button>
                      </Box>
                    </Card>
                    <WidgetForm
                      open={open}
                      onClose={() => handleClose(setOpen)}
                      handleAddChartData={handleAddChartData}
                      chartData={chartData}
                      widget={widgetTitle}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )
          )
        ) : (
          <Box
            height="100%"
            width="100%"
            display="flex"
            flexDirection="row"
            gap={2}
            justifyContent="center"
          >
            <Error />
            <Typography variant="body1">No Data Found</Typography>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default Widget;
