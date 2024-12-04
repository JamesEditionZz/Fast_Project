import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

function Pie() {
  const pieRef = useRef(null);

  useEffect(() => {
    const ctx = pieRef.current;

    // Destroy existing chart instance on this canvas
    let chartStatus = Chart.getChart(ctx); // Use the canvas element itself
    if (chartStatus) {
      chartStatus.destroy();
    }

    // Create a new Pie chart
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["SD-A-DS1-I-1260", "SD-A-DD8-I-6015", "SD-O-DS1-I-1260", "SD-O-DS1-I-1560", "SD-A-DD10-I-7515", "SD-A-DD10-I-6012", "SD-A-DD6-I-4515"],
        datasets: [
          {
            label: "จำนวน",
            data: [12, 19, 3, 5, 7, 20, 30],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(200, 100, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(115, 30, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(200, 100, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(115, 30, 132, 1)",
              "rgba(54, 162, 235, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "สินค้าขายเยอะ",
          },
        },
      },
    });
  }, []);

  return <canvas ref={pieRef}></canvas>;
}

export default Pie;