import React, { useState } from "react";

interface PreselectedCandidatesTableProps {
  candidates: any[];
}

const PreselectedCandidatesTable: React.FC<PreselectedCandidatesTableProps> = ({ candidates }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Preselected Candidates</h3>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">CV ID</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">Interview Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">Candidate Email</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{candidate.id}</td>
              <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{candidate.interviewDate}</td>
              <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{candidate.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PreselectedCandidatesTable;
