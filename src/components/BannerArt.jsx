// Simple drawings for the home banner (our own design)
function BannerArt({ type }) {
  if (type === "flute") {
    return (
      <svg viewBox="0 0 200 200" className="banner-art" role="img" aria-label="Flute">
        <g transform="rotate(-28 100 100)">
          <rect x="8" y="87" width="184" height="26" rx="13" fill="#d4961f" stroke="#7a4a05" strokeWidth="3" />
          <rect x="22" y="83" width="12" height="34" rx="5" fill="#7a4a05" />
          {[56, 78, 100, 122, 144, 166].map((x) => (
            <circle key={x} cx={x} cy="100" r="5.5" fill="#3b2304" />
          ))}
        </g>
      </svg>
    );
  }

  if (type === "notes") {
    return (
      <svg viewBox="0 0 200 200" className="banner-art" role="img" aria-label="Music notes">
        <text x="100" y="140" fontSize="130" textAnchor="middle" fill="#b30000">
          ♫
        </text>
      </svg>
    );
  }

  // keyboard (default)
  const whiteKeys = [0, 1, 2, 3, 4, 5, 6];
  const blackAfter = [0, 1, 3, 4, 5];

  return (
    <svg viewBox="0 0 200 200" className="banner-art" role="img" aria-label="Keyboard">
      <rect x="8" y="48" width="184" height="24" rx="5" fill="#222222" />
      {whiteKeys.map((i) => (
        <rect
          key={i}
          x={16 + i * 24}
          y="72"
          width="24"
          height="92"
          fill="#ffffff"
          stroke="#222222"
          strokeWidth="2"
        />
      ))}
      {blackAfter.map((i) => (
        <rect
          key={i}
          x={16 + (i + 1) * 24 - 8}
          y="72"
          width="16"
          height="56"
          rx="2"
          fill="#111111"
        />
      ))}
    </svg>
  );
}

export default BannerArt;
