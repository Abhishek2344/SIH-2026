import React from 'react';
import { CheckCircle2, Clock, Volume2, Scale, ShieldCheck, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StatusStepper = ({ status }) => {
  const { t } = useLanguage();
  const currentStatus = (status || "").toLowerCase();

  const isCancelled = currentStatus === 'cancelled';

  const steps = [
    { key: 'booked', label: t('booked') || "Booked", icon: Clock },
    { key: 'waiting', label: t('waiting') || "Waiting", icon: Clock },
    { key: 'called', label: t('called') || "Called", icon: Volume2 },
    { key: 'serving', label: t('serving') || "Serving", icon: Scale },
    { key: 'completed', label: t('completed') || "Completed", icon: ShieldCheck },
  ];

  const statusOrder = ['booked', 'waiting', 'called', 'serving', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="font-semibold text-sm md:text-base">Booking Cancelled</h4>
          <p className="text-xs text-red-600">This booking has been cancelled and is no longer in the active queue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connection line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-200 -z-0">
          <div
            className="h-full bg-farmer-600 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, (currentIndex / (steps.length - 1)) * 100))}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          let circleBg = "bg-white border-2 border-slate-300 text-slate-400";
          let labelColor = "text-slate-500";

          if (isDone) {
            circleBg = "bg-farmer-600 border-2 border-farmer-600 text-white shadow-sm";
            labelColor = "text-farmer-700 font-semibold";
          } else if (isCurrent) {
            circleBg = "bg-white border-2 border-farmer-600 text-farmer-600 ring-4 ring-farmer-100 shadow-md animate-pulse";
            labelColor = "text-farmer-800 font-bold";
          }

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${circleBg}`}>
                {isDone ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              <span className={`text-[10px] md:text-xs mt-1.5 text-center font-medium ${labelColor}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
