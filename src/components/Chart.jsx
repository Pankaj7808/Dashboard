import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Box, Card } from "@mui/material";

const Chart = ({ data, total, label }) => {
  const chartRef = useRef(null);

  const formatDataForChart = (data) => {
    // Ensure data is in the format [{ name: '...', value: ... }, ...]
    return data.map((item) => ({
      name: `${item.name} (${item.value})`,
      value: item.value,
    }));
  };

  const initChart = () => {
    const chartInstance = echarts.init(chartRef.current);
    const formattedData = formatDataForChart(data);

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "center",
        left: "40%",
        orient: "vertical",
        itemGap: 5,
        textStyle: {
          fontSize: 12,
          color: "#000",
        },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          center: ["20%", "40%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 1,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "center",
            formatter: () => `${total}\nTotal`,
            fontSize: 14,
            lineHeight: 25,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: formattedData,
        },
      ],
    };

    chartInstance.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, [data, total]);

  return (
    <Card sx={{ width: "100%" }}>
      <Box ref={chartRef} style={{ height: "200px", width: "100%" }}></Box>
    </Card>
  );
};

export default Chart;
