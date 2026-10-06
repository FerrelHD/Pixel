import React, { useMemo } from 'react';

export const SkylineBackground: React.FC = () => {
  // Generate deterministic twinkling stars
  const stars = useMemo(() => {
    const starList = [];
    for (let i = 0; i < 48; i++) {
      const top = Math.floor((i * 17) % 65);
      const left = Math.floor((i * 23) % 98);
      const size = i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
      const delay = (i % 5) * 0.7;
      starList.push({ id: i, top, left, size, delay });
    }
    return starList;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#04060d] via-[#090e1f] to-[#12192d]" />

      {/* Retro Pixel Moon */}
      <div className="absolute top-10 right-8 sm:right-24 w-16 h-16 sm:w-20 sm:h-20 opacity-90">
        <svg
          viewBox="0 0 16 16"
          className="w-full h-full pixel-crisp drop-shadow-[0_0_12px_rgba(250,204,21,0.25)]"
          shapeRendering="crispEdges"
        >
          {/* Pixelated Moon Body */}
          <rect x="4" y="0" width="8" height="1" fill="#fef08a" />
          <rect x="2" y="1" width="12" height="1" fill="#fef08a" />
          <rect x="1" y="2" width="14" height="2" fill="#fef08a" />
          <rect x="0" y="4" width="16" height="8" fill="#fef08a" />
          <rect x="1" y="12" width="14" height="2" fill="#fef08a" />
          <rect x="2" y="14" width="12" height="1" fill="#fef08a" />
          <rect x="4" y="15" width="8" height="1" fill="#fef08a" />

          {/* Craters */}
          <rect x="3" y="4" width="2" height="2" fill="#eab308" />
          <rect x="9" y="5" width="3" height="3" fill="#eab308" />
          <rect x="10" y="6" width="1" height="1" fill="#ca8a04" />
          <rect x="5" y="10" width="2" height="2" fill="#eab308" />
          <rect x="11" y="11" width="2" height="1" fill="#eab308" />
        </svg>
      </div>

      {/* Twinkling Pixel Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white pixel-crisp animate-pulse"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${2 + (star.id % 3)}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.size > 1 ? 0.85 : 0.5,
          }}
        />
      ))}

      {/* Layer 1: Far Silhouette Skyline (Dark Navy) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[65vh] opacity-60 pixel-crisp"
        preserveAspectRatio="none"
        viewBox="0 0 1000 400"
        shapeRendering="crispEdges"
      >
        {/* Background Towers */}
        <rect x="20" y="120" width="70" height="280" fill="#0c1224" />
        <rect x="100" y="70" width="90" height="330" fill="#090e1c" />
        <rect x="200" y="150" width="60" height="250" fill="#0c1224" />
        <rect x="270" y="90" width="100" height="310" fill="#090e1c" />
        <rect x="380" y="160" width="70" height="240" fill="#0c1224" />
        <rect x="460" y="60" width="120" height="340" fill="#070a14" />
        <rect x="590" y="140" width="80" height="260" fill="#0c1224" />
        <rect x="680" y="80" width="110" height="320" fill="#090e1c" />
        <rect x="800" y="130" width="75" height="270" fill="#0c1224" />
        <rect x="885" y="100" width="95" height="300" fill="#080c18" />

        {/* Radio Spire Antennas */}
        <rect x="143" y="30" width="4" height="40" fill="#090e1c" />
        <rect x="144" y="27" width="2" height="3" fill="#ef4444" className="animate-ping" />

        <rect x="518" y="20" width="4" height="40" fill="#070a14" />
        <rect x="519" y="17" width="2" height="3" fill="#ef4444" className="animate-ping" />

        <rect x="733" y="40" width="4" height="40" fill="#090e1c" />
        <rect x="734" y="37" width="2" height="3" fill="#ef4444" className="animate-ping" />
      </svg>

      {/* Layer 2: Midground Buildings with Lit Windows & Daily Bugle Billboard */}
      <div className="absolute bottom-0 left-0 w-full h-[55vh]">
        <svg
          className="w-full h-full pixel-crisp"
          preserveAspectRatio="none"
          viewBox="0 0 1200 450"
          shapeRendering="crispEdges"
        >
          {/* Building Silhouettes */}
          <rect x="0" y="180" width="140" height="270" fill="#11182c" />
          <rect x="150" y="120" width="180" height="330" fill="#162038" />
          <rect x="340" y="210" width="130" height="240" fill="#131c33" />

          {/* Oscorp Tower (Center Left) */}
          <rect x="480" y="90" width="200" height="360" fill="#0f1629" />
          <rect x="575" y="45" width="10" height="45" fill="#0f1629" />
          {/* Spire beacon */}
          <rect x="578" y="40" width="4" height="5" fill="#38bdf8" className="animate-pulse" />

          {/* Daily Bugle Building (Center Right) */}
          <rect x="690" y="140" width="230" height="310" fill="#18233e" />

          {/* Right Skyline Buildings */}
          <rect x="930" y="190" width="140" height="260" fill="#121a30" />
          <rect x="1080" y="110" width="120" height="340" fill="#151e36" />

          {/* Rooftop Water Towers */}
          {/* Water Tower 1 */}
          <rect x="170" y="95" width="26" height="25" fill="#0f172a" />
          <rect x="168" y="90" width="30" height="5" fill="#1e293b" />
          <rect x="174" y="120" width="4" height="6" fill="#0f172a" />
          <rect x="188" y="120" width="4" height="6" fill="#0f172a" />

          {/* Water Tower 2 on Daily Bugle */}
          <rect x="870" y="115" width="26" height="25" fill="#0f172a" />
          <rect x="868" y="110" width="30" height="5" fill="#1e293b" />
          <rect x="874" y="140" width="4" height="6" fill="#0f172a" />
          <rect x="888" y="140" width="4" height="6" fill="#0f172a" />

          {/* Lit Windows Pattern (Oscorp & Daily Bugle) */}
          {/* Building 150-330 */}
          <rect x="170" y="150" width="12" height="16" fill="#fef08a" opacity="0.75" />
          <rect x="200" y="150" width="12" height="16" fill="#38bdf8" opacity="0.6" />
          <rect x="230" y="150" width="12" height="16" fill="#fef08a" opacity="0.8" />
          <rect x="170" y="190" width="12" height="16" fill="#fef08a" opacity="0.5" />
          <rect x="260" y="190" width="12" height="16" fill="#fef08a" opacity="0.7" />
          <rect x="200" y="230" width="12" height="16" fill="#38bdf8" opacity="0.6" />

          {/* Oscorp Windows */}
          <rect x="510" y="120" width="14" height="20" fill="#38bdf8" opacity="0.85" />
          <rect x="540" y="120" width="14" height="20" fill="#38bdf8" opacity="0.6" />
          <rect x="630" y="120" width="14" height="20" fill="#38bdf8" opacity="0.8" />
          <rect x="510" y="160" width="14" height="20" fill="#fef08a" opacity="0.7" />
          <rect x="600" y="160" width="14" height="20" fill="#fef08a" opacity="0.8" />
          <rect x="540" y="200" width="14" height="20" fill="#38bdf8" opacity="0.75" />
          <rect x="630" y="200" width="14" height="20" fill="#fef08a" opacity="0.6" />

          {/* Daily Bugle Windows */}
          <rect x="720" y="180" width="14" height="18" fill="#fef08a" opacity="0.85" />
          <rect x="750" y="180" width="14" height="18" fill="#fef08a" opacity="0.4" />
          <rect x="780" y="180" width="14" height="18" fill="#fef08a" opacity="0.9" />
          <rect x="720" y="220" width="14" height="18" fill="#fef08a" opacity="0.6" />
          <rect x="810" y="220" width="14" height="18" fill="#38bdf8" opacity="0.7" />
          <rect x="750" y="260" width="14" height="18" fill="#fef08a" opacity="0.8" />
          <rect x="780" y="260" width="14" height="18" fill="#fef08a" opacity="0.5" />
        </svg>

        {/* Daily Bugle Retro Neon Sign */}
        <div className="absolute top-[28%] left-[58%] sm:left-[60%] -translate-x-1/2 flex items-center justify-center">
          <div className="border-2 border-red-500/80 bg-midnight-950/90 px-3 py-1 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <span className="font-pixel text-[9px] sm:text-[11px] text-red-500 font-bold tracking-widest animate-pulse">
              DAILY BUGLE
            </span>
          </div>
        </div>
      </div>

      {/* Layer 3: Foreground Rooftop Ledge Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-midnight-950 via-midnight-950/95 to-transparent flex items-end">
        {/* Brick parapet ledge border */}
        <div className="w-full h-8 border-t-4 border-midnight-700 bg-midnight-900/95 flex justify-between items-center px-4">
          <div className="h-2 w-12 bg-midnight-700" />
          <div className="h-2 w-20 bg-midnight-700" />
          <div className="h-2 w-16 bg-midnight-700" />
          <div className="h-2 w-24 bg-midnight-700" />
        </div>
      </div>
    </div>
  );
};
