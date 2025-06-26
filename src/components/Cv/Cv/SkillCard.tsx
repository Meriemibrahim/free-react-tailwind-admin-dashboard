import React from "react";
import { Skills } from "../../../../types/Skills";

interface SkillCardProps {
  skill: Skills;
  onEdit: (skill: Skills) => void;
  onDelete: (skillId: number) => void;
}

export const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
  return (
   <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-4 flex justify-between items-center border border-gray-200 dark:border-gray-700">
  <div>
    <h5 className="text-md font-semibold text-gray-800 dark:text-white">{skill.name}</h5>
    <p className="text-sm text-gray-500 dark:text-gray-400">{skill.proficiencyLevel}</p>
  </div>

</div>
  );
};