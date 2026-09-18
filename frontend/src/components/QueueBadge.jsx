import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const QueueBadge = ({ status, size = "md" }) => {
  const { t } = useLanguage();
  const s = (status || "").toLowerCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs md:text-sm font-medium",
    lg: "px-3.5 py-1.5 text-sm md:text-base font-semibold",
  };

  let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";
  let label = s;

  if (s === 'booked') {
    badgeClasses = "bg-blue-50 text-blue-700 border-blue-200";
    label = t('booked') || "Booked";
  } else if (s === 'waiting') {
    badgeClasses = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
    label = t('waiting');
  } else if (s === 'called') {
    badgeClasses = "bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-400/50 animate-bounce";
    label = t('called');
  } else if (s === 'serving') {
    badgeClasses = "bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/50";
    label = t('serving');
  } else if (s === 'completed') {
    badgeClasses = "bg-green-50 text-green-700 border-green-200";
    label = t('completed');
  } else if (s === 'cancelled') {
    badgeClasses = "bg-red-50 text-red-700 border-red-200";
    label = t('cancelled');
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses[size] || sizeClasses.md} ${badgeClasses}`}>
      <span className="h-2 w-2 rounded-full bg-current"></span>
      {label}
    </span>
  );
};

export default QueueBadge;
