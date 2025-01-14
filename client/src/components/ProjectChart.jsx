import React from "react";
import { Container } from "react-bootstrap";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { format, addBusinessDays, isValid } from "date-fns";
import "chartjs-adapter-date-fns";
import { enGB } from "date-fns/locale";
import { getRandomColor } from "../utils/randomColourGenerator";

ChartJS.register(...registerables);

const ProjectChart = ({
  projectId,
  rawHourEstimates,
  modifiedWeekEstimates,
}) => {
  const options = {
    animation: false,
    spanGaps: true,
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Estimated time to complete all assigned features (hours)",
        },
        grid: {
          display: false,
        },
      },
      x: {
        adapters: {
          date: {
            locale: enGB,
          },
        },
        type: "time",
        distribution: "linear",
        time: {
          parser: "dd/MM/yyyy",
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { position: "right" },
    },
  };

  const currentDate = format(new Date(), "dd/MM/yyyy");

  const names = Object.keys(rawHourEstimates);

  const getFinishDate = (name) => {
    const weeks = modifiedWeekEstimates[name];
    const days = Math.round(weeks * 5);
    const completionDate = addBusinessDays(new Date(), days);
    return isValid(completionDate) ? format(completionDate, "dd/MM/yyyy") : currentDate;
  };

  const myDataSets = names.map((name) => {
    return {
      label: name,
      data: [
        { x: currentDate, y: rawHourEstimates[name] },
        { x: getFinishDate(name), y: 0 },
      ],
      borderColor: getRandomColor(),
      showLine: true,
    };
  });

  const data = {
    datasets: myDataSets,
  };

  const getLatestFinishDate = () => {
    const data = Object.values(modifiedWeekEstimates);
    const weeks = Math.max(...data);
    const days = Math.round(weeks * 5);
    const completionDate = addBusinessDays(new Date(), days);
    return isValid(completionDate) ? format(completionDate, "dd/MM/yyyy") : "N/A";
  };

  return (
    <>
      <p>
        Only taking "must-have" features into consideration, it's estimated that
        this project will be complete on <b>{getLatestFinishDate()}</b>.
      </p>
      <Container>
        <Line
          options={options}
          data={data}
          style={{ vh: 50 }}
          datasetIdKey="id"
        />
      </Container>
    </>
  );
};

export default ProjectChart;
