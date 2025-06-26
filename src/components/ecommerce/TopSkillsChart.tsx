import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { dashboardService } from "../../services/dashboardService";

export default function TopSkillsChart() {
  const [skillsData, setSkillsData] = useState<{ skillName: string; candidateCount: number }[]>([]);

  useEffect(() => {
    dashboardService.getTopSkills()
      .then(setSkillsData)
      .catch(console.error);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toString(),
      style: { colors: ["#fff"] },
    },
    xaxis: {
      categories: skillsData.map((s) => s.skillName),
      title: { text: "Nombre de candidats" },
    },
    yaxis: {
      labels: {
        style: { fontSize: "14px" },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => val.toString(),
      },
    },
  };

  const series = [
    {
      name: "Candidats",
      data: skillsData.map((s) => s.candidateCount),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Top 10 Compétences (Nombre de candidats)
      </h3>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
