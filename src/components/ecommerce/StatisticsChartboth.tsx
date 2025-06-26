import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import ChartTab from "../common/ChartTab";
import { dashboardService } from "../../services/dashboardService";

export default function StatisticsChartboth() {
  // Données offres par mois
  const [offersPerMonth, setOffersPerMonth] = useState<number[]>([]);
  // Données entretiens par offre
  const [interviewTitles, setInterviewTitles] = useState<string[]>([]);
  const [interviewCounts, setInterviewCounts] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const jobsData = await dashboardService.getJobsPerMonth();
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const counts = months.map((m) => jobsData[m] || 0);
        setOffersPerMonth(counts);

        const interviewsData = await dashboardService.getInterviewsPerOffer();
        setInterviewTitles(interviewsData.map((d) => d.title));
        setInterviewCounts(interviewsData.map((d) => d.count));
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    }

    fetchData();
  }, []);

  // Options pour offres par mois (ligne)
  const optionsOffers: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 310,
      toolbar: { show: false },
    },
    colors: ["#465FFF"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.5, opacityTo: 0 },
    },
    markers: { size: 4 },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      title: { text: "Offres publiées" },
    },
    grid: { yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    legend: { show: false },
  };

  const seriesOffers = [
    { name: "Offres publiées", data: offersPerMonth }
  ];

  // Options pour entretiens par offre (barres)
  const optionsInterviews: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#00b894"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", colors: ["#333"] },
    },
    xaxis: {
      categories: interviewTitles,
      labels: { rotate: -45, style: { fontSize: "12px" } },
      title: { text: "Offres" },
    },
    yaxis: {
      title: { text: "Nombre d'entretiens" },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} entretiens` },
    },
    grid: { yaxis: { lines: { show: true } } },
  };

  const seriesInterviews = [
    { name: "Entretiens", data: interviewCounts }
  ];

  return (
    <div className="space-y-12">
      {/* Graphique offres par mois */}
      

      {/* Graphique entretiens par offre */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Nombre d'entretiens par offre
          </h3>
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            Charge des entretiens par offre d'emploi
          </p>
        </div>
        <Chart options={optionsInterviews} series={seriesInterviews} type="bar" height={400} />
      </div>
    </div>
  );
}
