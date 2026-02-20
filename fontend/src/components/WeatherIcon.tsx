interface WeatherIconProps {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WeatherIcon({ type, size = "md", className = "" }: WeatherIconProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const s = sizeMap[size];

  const icons: Record<string, React.ReactNode> = {
    sunny: (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <circle cx="50" cy="50" r="22" fill="#FBBF24" className="animate-pulse" style={{ animationDuration: "3s" }} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + 30 * Math.cos(rad);
          const y1 = 50 + 30 * Math.sin(rad);
          const x2 = 50 + 40 * Math.cos(rad);
          const y2 = 50 + 40 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FBBF24"
              strokeWidth="4"
              strokeLinecap="round"
              className="origin-center"
              style={{
                animation: "spin 12s linear infinite",
                transformOrigin: "50px 50px",
              }}
            />
          );
        })}
      </svg>
    ),
    "partly-cloudy": (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <circle cx="62" cy="35" r="16" fill="#FBBF24" className="animate-pulse" style={{ animationDuration: "3s" }} />
        <ellipse cx="42" cy="62" rx="28" ry="16" fill="white" opacity="0.9">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="34" cy="56" rx="14" ry="14" fill="white" opacity="0.9">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="52" cy="56" rx="12" ry="12" fill="white" opacity="0.85">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    ),
    cloudy: (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <ellipse cx="50" cy="60" rx="32" ry="18" fill="white" opacity="0.85">
          <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="38" cy="52" rx="18" ry="18" fill="white" opacity="0.9">
          <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="58" cy="50" rx="16" ry="16" fill="white" opacity="0.8">
          <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    ),
    rainy: (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <ellipse cx="50" cy="40" rx="30" ry="16" fill="white" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="38" cy="34" rx="16" ry="16" fill="white" opacity="0.75">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="56" cy="32" rx="14" ry="14" fill="white" opacity="0.65">
          <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {[35, 48, 61].map((x, i) => (
          <line key={i} x1={x} y1="58" x2={x - 4} y2="72" stroke="white" opacity="0.5" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y1" values="58;62;58" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values="72;78;72" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>
    ),
    night: (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <path
          d="M55 20 C35 20, 20 40, 30 60 C15 55, 15 75, 35 78 C30 90, 60 90, 65 78 C80 82, 85 60, 70 50 C85 35, 70 15, 55 20Z"
          fill="none"
          stroke="white"
          strokeWidth="0"
        />
        <circle cx="45" cy="45" r="0" fill="#E2E8F0" />
        <path
          d="M62 25C48 28, 38 42, 42 58C42 58, 35 75, 55 78C55 78, 72 78, 72 60C72 42, 65 25, 62 25Z"
          fill="#E2E8F0"
          opacity="0"
        />
        <path
          d="M58 22 Q38 30, 38 52 Q38 72, 56 76 Q46 78, 36 70 Q24 60, 30 44 Q34 28, 54 20Z"
          fill="#F1F5F9"
          opacity="0.9"
        >
          <animate attributeName="opacity" values="0.9;0.7;0.9" dur="4s" repeatCount="indefinite" />
        </path>
        <circle cx="72" cy="28" r="1.5" fill="white" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="78" cy="42" r="1" fill="white" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="68" cy="68" r="1.2" fill="white" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="82" cy="55" r="0.8" fill="white" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    haze: (
      <svg viewBox="0 0 100 100" className={`${s} ${className}`}>
        <circle cx="50" cy="38" r="16" fill="#F59E0B" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        {[52, 62, 72].map((y, i) => (
          <line key={i} x1="22" y1={y} x2="78" y2={y} stroke="white" opacity={0.4 - i * 0.08} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="x1" values="22;26;22" dur={`${3 + i}s`} repeatCount="indefinite" />
            <animate attributeName="x2" values="78;74;78" dur={`${3 + i}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>
    ),
  };

  return icons[type] || icons.sunny;
}
