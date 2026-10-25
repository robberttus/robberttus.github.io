import React from 'react';
import { Gamepad2, Code2, ArrowUpRight } from 'lucide-react';

export const GamesVisualCard: React.FC = () => {
  return (
    <div className="relative aspect-square sm:aspect-video w-full overflow-hidden bg-[#070707] select-none group">
      <img
        src="/images/games.jpeg"
        alt="Games op robbesonck.be"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {/* Subtle dark gradient scrim for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />

      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-[#0a0a0a]/90 border border-[#2e2e2e] px-2.5 py-1 text-[11px] font-mono-tech text-[#ffa600]">
        <Gamepad2 className="w-3.5 h-3.5" />
        <span>Banana Games</span>
      </div>
    </div>
  );
};

export const ProjectsVisualCard: React.FC = () => {
  return (
    <div className="relative aspect-square sm:aspect-video w-full overflow-hidden bg-[#070707] select-none group">
      <img
        src="/images/projects.png"
        alt="Projects op robbesonck.be"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {/* Subtle dark gradient scrim for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />

      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-[#0a0a0a]/90 border border-[#2e2e2e] px-2.5 py-1 text-[11px] font-mono-tech text-[#ffa600]">
        <Code2 className="w-3.5 h-3.5" />
        <span>Projects</span>
        <ArrowUpRight className="w-3 h-3" />
      </div>
    </div>
  );
};
