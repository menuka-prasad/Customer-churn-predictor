import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface GaugeChartProps {
  value: number; // 0-100
}

export function GaugeChart({ value }: GaugeChartProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate rotation for the needle (-90 to 90 degrees)
  const rotation = -90 + (displayValue / 100) * 180;

  // Determine color based on value
  const getColor = (val: number) => {
    if (val < 30) return '#10b981'; // green
    if (val < 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const color = getColor(value);

  // SVG gauge parameters
  const size = 280;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle

  return (
    <div className="relative flex flex-col items-center">
      {/* Percentage Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="mb-4"
      >
        <div className="text-5xl sm:text-6xl font-bold text-white">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayValue}
          </motion.span>
          <span className="text-3xl sm:text-4xl text-slate-400">%</span>
        </div>
      </motion.div>

      {/* SVG Gauge */}
      <svg
        width={size}
        height={size / 1.5}
        viewBox={`0 0 ${size} ${size / 1.5}`}
        className="overflow-visible"
      >
        {/* Background Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Animated Progress Arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - displayValue / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Center Dot */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={8}
          fill={color}
          className="drop-shadow-lg"
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ originX: `${size / 2}px`, originY: `${size / 2}px` }}
        >
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2}
            y2={size / 2 - radius + strokeWidth / 2}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
        </motion.g>
      </svg>

      {/* Labels */}
      <div className="flex justify-between w-full max-w-[260px] mt-2 px-2">
        <span className="text-xs text-emerald-400 font-semibold">Low</span>
        <span className="text-xs text-amber-400 font-semibold">Medium</span>
        <span className="text-xs text-red-400 font-semibold">High</span>
      </div>
    </div>
  );
}
