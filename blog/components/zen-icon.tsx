export function ZenIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="zen cosmic flow icon"
    >
      <defs>
        <style>
          {`.ink { stroke: currentColor; }
           .amber { stroke: #B98A41; }`}
        </style>
      </defs>

      {/* mandala hint */}
      <circle
        cx="32"
        cy="32"
        r="20"
        className="ink"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".35"
      />
      <circle
        cx="32"
        cy="32"
        r="14"
        className="ink"
        fill="none"
        strokeWidth="1.25"
        strokeDasharray="2 4"
        opacity=".25"
      />

      {/* quiet radial guides */}
      <path
        d="M32 12v40M12 32h40M18.7 18.7l26.6 26.6M45.3 18.7L18.7 45.3"
        className="ink"
        fill="none"
        strokeWidth="1"
        opacity=".15"
      />

      {/* flowing water nebula line */}
      <path
        d="M6 40c8-10 22-10 30 0 5.5 7 13 9 22 4"
        className="ink"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".55"
      />

      {/* second softer current */}
      <path
        d="M8 26c9 7 21 7 29 0 6-5 12-6 19-3"
        className="ink"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".30"
      />

      {/* faint stars specks */}
      <g className="amber" fill="none" strokeWidth="1">
        <circle cx="22" cy="18" r="0.9" opacity=".45" />
        <circle cx="46" cy="24" r="0.7" opacity=".35" />
        <circle cx="36" cy="46" r="0.8" opacity=".35" />
      </g>
    </svg>
  )
}
