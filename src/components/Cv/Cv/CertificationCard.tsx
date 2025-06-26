import React from "react";
import { Certification } from "../../../../types/certification";

type Props = {
  certification: Certification;
  onRemove?: (id: number) => void;
  onEdit?: (certification: Certification) => void;  // ajout du callback pour modifier
};

const CertificationCard: React.FC<Props> = ({ certification, onRemove, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 flex flex-col justify-between">
      <div>
        <h5 className="font-semibold text-gray-900 dark:text-white">{certification.name}</h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">{certification.provider}</p>
        {certification.dateIssued && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Délivrée le : {new Date(certification.dateIssued).toLocaleDateString()}
          </p>
        )}
      </div>

    
    </div>
  );
};

export default CertificationCard;
