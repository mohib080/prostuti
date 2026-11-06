"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface ExamTimerProps {
  durationMinutes: number;
  onTimeExpired: () => void;
  onTick?: (secondsLeft: number) => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  durationMinutes,
  onTimeExpired,
  onTick,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const nextVal = prev - 1;
        if (onTick) onTick(nextVal);
        if (nextVal <= 0) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onTimeExpired, onTick]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const isLowTime = secondsRemaining <= 300; // less than 5 minutes

  const formatDigits = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wider shadow-sm transition-all ${
        isLowTime
          ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
          : "bg-white border-[#E7E3D9] text-[#24483B]"
      }`}
    >
      {isLowTime ? (
        <AlertCircle className="w-4 h-4 text-rose-600" />
      ) : (
        <Clock className="w-4 h-4 text-[#24483B]" />
      )}
      <span>
        {hours > 0 && `${formatDigits(hours)}:`}
        {formatDigits(minutes)}:{formatDigits(seconds)}
      </span>
      {isLowTime && (
        <span className="text-[10px] uppercase font-sans font-semibold text-rose-600 font-bengali">
          সময় শেষের দিকে
        </span>
      )}
    </div>
  );
};
