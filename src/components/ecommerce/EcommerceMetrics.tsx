import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BoxIconLine,
  GroupIcon,
  CalenderIcon,
  CheckCircleIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { dashboardService } from "../../services/dashboardService"; // سننشئه

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState({
    nbCandidates: 0,
    nbCandidatesActive: 0,
    nbJobs: 0,
    nbJobsOpen: 0,
    nbInterviews: 0,
    nbAccepted: 0,
  });

  useEffect(() => {
    dashboardService.getMetrics().then((data) => setMetrics(data));
  }, []);

  return (
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
<MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        label="Candidats"
        value={metrics.nbCandidates}
      />
      <MetricCard
        icon={<GroupIcon className="text-green-600 size-6 dark:text-white/90" />}
        label="Candidats Acceptés"
        value={metrics.nbCandidatesActive}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        label="Offres"
        value={metrics.nbJobs}
      />
      <MetricCard
        icon={<BoxIconLine className="text-blue-600 size-6 dark:text-white/90" />}
        label="Offres Ouvertes"
        value={metrics.nbJobsOpen}
      />
      <MetricCard
        icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
        label="Entretiens"
        value={metrics.nbInterviews}
      />
      <MetricCard
        icon={<CheckCircleIcon className="text-green-800 size-6 dark:text-white/90" />}
        label="Entretiens Complets"
        value={metrics.nbAccepted}
      />
    </div>
  );
}

function MetricCard({ icon, label, value, change, direction }: any) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        </div>
        <Badge color={"success"}>
          {change}
        </Badge>
      </div>
    </div>
  );
}
