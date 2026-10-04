import { motion } from 'framer-motion';

interface EclipseProps {
  size?: 'logo' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  interactive?: boolean;
}

export function Eclipse({ size = 'md', className = '', interactive = false }: EclipseProps) {
  const dimensions = {
    logo: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    hero: 'w-64 h-64 md:w-80 md:h-80',
  }[size];

  const particlesCount = size === 'hero' ? 16 : size === 'lg' ? 10 : 6;

  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className} shrink-0`}>
      {/* Outer Atmospheric Radiant Glow */}
      <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse" />

      {/* Layered Burnt-Orange & Gold Corona Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-accent/40 opacity-80"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #F2A36D 25%, transparent 50%, #E6B86C 75%, transparent 100%)',
          boxShadow: '0 0 35px rgba(242, 163, 109, 0.4), inset 0 0 25px rgba(242, 163, 109, 0.3)',
        }}
      />

      {/* Secondary Inner Flares Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-1 rounded-full border border-warning/30 opacity-60"
        style={{
          boxShadow: '0 0 20px rgba(230, 184, 108, 0.3)',
        }}
      />

      {/* Floating Solar Particles */}
      {size !== 'logo' && size !== 'sm' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          {Array.from({ length: particlesCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent/80"
              style={{
                top: `${20 + (i * 15) % 60}%`,
                left: `${15 + (i * 22) % 70}%`,
              }}
              animate={{
                y: [-4, 4, -4],
                x: [-3, 3, -3],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Dark Stable Central Disc */}
      <div
        className="relative z-10 w-[82%] h-[82%] rounded-full bg-[#101214] border border-white/10 flex items-center justify-center shadow-2xl"
        style={{
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
        }}
      >
        {interactive && (
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-ping" />
        )}
      </div>
    </div>
  );
}
