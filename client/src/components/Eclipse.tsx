import { motion } from 'framer-motion';

interface EclipseProps {
  size?: 'logo' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  interactive?: boolean;
}

// Explicit pixel sizes that match the Tailwind classes — used as inline styles
// so flexbox/grid can NEVER override the square dimensions.
const SIZE_PX: Record<string, { sm: number; md: number }> = {
  logo: { sm: 24,  md: 24  },
  sm:   { sm: 40,  md: 40  },
  md:   { sm: 96,  md: 96  },
  lg:   { sm: 160, md: 160 },
  hero: { sm: 192, md: 224 },
};

export function Eclipse({ size = 'md', className = '', interactive = false }: EclipseProps) {
  const twClass = {
    logo: 'w-6 h-6',
    sm:   'w-10 h-10',
    md:   'w-24 h-24',
    lg:   'w-40 h-40',
    hero: 'w-48 h-48 md:w-56 md:h-56',
  }[size];

  // Lock the container to a square with explicit px so flex/grid can't distort it.
  // We use the smaller (mobile) breakpoint here; md: is handled via the Tailwind class
  // and the browser will apply whichever wins. We clamp with min-width/min-height.
  const { sm: sizePx } = SIZE_PX[size];

  const isHero  = size === 'hero';
  const isLarge = size === 'hero' || size === 'lg';
  const particlesCount = isHero ? 14 : size === 'lg' ? 8 : 5;

  return (
    <div
      className={`relative flex items-center justify-center ${twClass} ${className}`}
      role="img"
      aria-label="Eclipse visual motif"
      style={{
        // Explicit square lock — prevents any flex parent from squishing/stretching
        flexShrink: 0,
        flexGrow: 0,
        minWidth: sizePx,
        minHeight: sizePx,
        aspectRatio: '1 / 1',
      }}
    >
      {/* Deep atmosphere bloom (outermost halo) */}
      {isHero && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-55%',
            background:
              'radial-gradient(ellipse at center, rgba(242,163,109,0.09) 0%, rgba(242,163,109,0.04) 40%, transparent 70%)',
          }}
        />
      )}

      {/* Mid atmosphere glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: isHero ? '-30%' : '-18%',
          background:
            'radial-gradient(ellipse at center, rgba(242,163,109,0.14) 0%, rgba(230,184,108,0.06) 50%, transparent 75%)',
          animation: 'eclipse-pulse 3s ease-in-out infinite',
        }}
      />

      {/* Diffraction cross-spikes (hero only) */}
      {isHero && (
        <>
          <div
            className="absolute pointer-events-none"
            style={{
              top: '50%', left: '-42%', right: '-42%', height: '1px',
              transform: 'translateY(-50%)',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(242,163,109,0.12) 30%, rgba(242,163,109,0.55) 50%, rgba(242,163,109,0.12) 70%, transparent 100%)',
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%', top: '-42%', bottom: '-42%', width: '1px',
              transform: 'translateX(-50%)',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(242,163,109,0.12) 30%, rgba(242,163,109,0.55) 50%, rgba(242,163,109,0.12) 70%, transparent 100%)',
            }}
          />
          {/* Diagonal spike (45°) */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0, transform: 'rotate(45deg)',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(230,184,108,0.06) 30%, rgba(230,184,108,0.25) 50%, rgba(230,184,108,0.06) 70%, transparent 100%)',
              height: '1px',
              top: '50%',
              left: '-30%',
              right: '-30%',
              width: '160%',
            }}
          />
        </>
      )}

      {/* Outer conic corona ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(242,163,109,0.5) 18%, rgba(230,184,108,0.75) 26%, rgba(242,163,109,0.5) 34%, transparent 50%, rgba(230,184,108,0.28) 70%, rgba(242,163,109,0.38) 78%, transparent 100%)',
          boxShadow: isHero
            ? '0 0 42px 8px rgba(242,163,109,0.32), 0 0 80px 20px rgba(242,163,109,0.12), inset 0 0 28px rgba(242,163,109,0.18)'
            : '0 0 22px 4px rgba(242,163,109,0.28), inset 0 0 14px rgba(242,163,109,0.14)',
        }}
      />

      {/* Counter-rotating chromatic ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{
          inset: '4px',
          background:
            'conic-gradient(from 180deg, transparent 0%, rgba(230,184,108,0.22) 20%, transparent 42%, rgba(219,129,120,0.12) 65%, transparent 85%)',
          border: '1px solid rgba(230,184,108,0.18)',
        }}
      />

      {/* Slow tertiary ring (large sizes only) */}
      {isLarge && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full"
          style={{
            inset: '2px',
            border: '1px solid rgba(242,163,109,0.10)',
            boxShadow: '0 0 10px rgba(242,163,109,0.12)',
          }}
        />
      )}

      {/* Floating solar particles */}
      {size !== 'logo' && size !== 'sm' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          {Array.from({ length: particlesCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width:  isHero ? (i % 3 === 0 ? '3px' : '2px') : '1.5px',
                height: isHero ? (i % 3 === 0 ? '3px' : '2px') : '1.5px',
                top:  `${18 + (i * 13) % 64}%`,
                left: `${12 + (i * 19) % 76}%`,
                background: i % 4 === 0 ? '#E6B86C' : '#F2A36D',
              }}
              animate={{
                y:       [-5, 5, -5],
                x:       [-4, 4, -4],
                opacity: [0.2, 1, 0.2],
                scale:   [0.7, 1.4, 0.7],
              }}
              transition={{
                duration: 2.5 + (i % 4),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35,
              }}
            />
          ))}
        </div>
      )}

      {/* Central dark disc — inset-based so it stays circular in any square parent */}
      <div
        className="absolute rounded-full bg-[#101214] border border-white/10 flex items-center justify-center z-10"
        style={{
          inset: '10%',   // 80% of container, perfectly square
          boxShadow:
            'inset 0 0 22px rgba(0,0,0,0.98), inset 0 0 8px rgba(242,163,109,0.04), 0 0 12px rgba(0,0,0,0.9)',
        }}
      >
        {isHero && (
          <div
            className="absolute inset-0 rounded-full opacity-25"
            style={{
              background:
                'radial-gradient(ellipse at 35% 35%, rgba(242,163,109,0.07) 0%, transparent 60%)',
            }}
          />
        )}
        {interactive && (
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-ping" />
        )}
      </div>
    </div>
  );
}
