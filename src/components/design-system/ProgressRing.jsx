import { useId } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  showGlow = true,
  animated = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Use React's useId for stable, unique IDs
  const gradientId = useId();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--aurora-teal))" />
            <stop offset="50%" stopColor="hsl(var(--aurora-violet))" />
            <stop offset="100%" stopColor="hsl(var(--aurora-coral))" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-30"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? offset : circumference }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={
            showGlow
              ? {
                  filter:
                    "drop-shadow(0 0 8px hsl(var(--aurora-violet) / 0.5))",
                }
              : {}
          }
        />
      </svg>

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

ProgressRing.propTypes = {
  progress: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
  showGlow: PropTypes.bool,
  animated: PropTypes.bool,
};

export { ProgressRing };
