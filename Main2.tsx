import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  random,
  registerRoot,
} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';

// Color palette
const colors = {
  sky: '#87CEEB',
  ocean: '#006994',
  sun: '#FFD700',
  cloud: '#F0F0F0',
  rain: '#4682B4',
  ground: '#8B4513',
  grass: '#228B22',
  text: '#2C3E50',
  white: '#FFFFFF',
};

// Title Scene Component
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleScale = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });
  
  const subtitleOpacity = interpolate(
    frame,
    [20, 40],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${colors.sky}, ${colors.ocean})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${titleScale})`, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 80,
            color: colors.white,
            fontWeight: 'bold',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
            marginBottom: 20,
          }}>
            The Water Cycle
          </h1>
          <p style={{
            fontSize: 36,
            color: colors.white,
            opacity: subtitleOpacity,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}>
            Nature's Continuous Journey
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Sun Component
const Sun: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 300], [0, 360]);
  
  return (
    <div style={{
      position: 'absolute',
      top: 50,
      right: 100,
      width: 150 * scale,
      height: 150 * scale,
      background: colors.sun,
      borderRadius: '50%',
      boxShadow: `0 0 50px ${colors.sun}`,
      transform: `rotate(${rotation}deg)`,
    }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${i * 45}deg)`,
          }}
        >
          <div style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            width: 20,
            height: 40,
            background: colors.sun,
            transform: 'translateX(-50%)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }} />
        </div>
      ))}
    </div>
  );
};

// Cloud Component
const Cloud: React.FC<{ x: number; y: number; scale?: number; delay?: number }> = ({ 
  x, 
  y, 
  scale = 1, 
  delay = 0 
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - delay,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{ position: 'relative' }}>
        {[
          { size: 80, left: 0, top: 20 },
          { size: 100, left: 30, top: 0 },
          { size: 90, left: 70, top: 10 },
          { size: 70, left: 110, top: 25 },
        ].map((circle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: circle.size,
              height: circle.size,
              borderRadius: '50%',
              background: colors.cloud,
              left: circle.left,
              top: circle.top,
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Water Drop Component
const WaterDrop: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  
  const y = interpolate(
    frame - delay,
    [0, 60],
    [200, height - 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const opacity = frame >= delay && frame <= delay + 60 ? 1 : 0;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
      }}
    >
      <div style={{
        width: 20,
        height: 30,
        background: colors.rain,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
};

// Evaporation Scene
const EvaporationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  // Sun rays animation
  const rayOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.7, 0.3],
  );
  
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${colors.sky}, ${colors.ocean})` }}>
      <Sun />
      
      {/* Sun rays */}
      <div style={{
        position: 'absolute',
        top: 125,
        right: 175,
        width: 500,
        height: 500,
        opacity: rayOpacity,
      }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: 500,
              background: `linear-gradient(to bottom, ${colors.sun}, transparent)`,
              transform: `rotate(${i * 30 + 15}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>
      
      {/* Ocean */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
        background: colors.ocean,
        overflow: 'hidden',
      }}>
        {/* Water waves */}
        {[...Array(3)].map((_, i) => {
          const waveOffset = interpolate(
            frame,
            [0, 120],
            [0, -100],
          );
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '200%',
                height: 60,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                top: i * 30,
                left: waveOffset + i * 50,
              }}
            />
          );
        })}
      </div>
      
      {/* Evaporation particles with wavy motion */}
      {[...Array(15)].map((_, i) => {
        const delay = i * 5;
        const baseX = 300 + i * 60;
        
        const particleY = interpolate(
          frame - delay,
          [0, 80],
          [450, 50],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        const particleX = baseX + Math.sin((frame - delay) * 0.1) * 20;
        
        const particleOpacity = interpolate(
          frame - delay,
          [0, 20, 60, 80],
          [0, 0.8, 0.8, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        const particleScale = interpolate(
          frame - delay,
          [0, 80],
          [0.5, 2],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: particleX,
              top: particleY,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(135, 206, 235, 0.6)',
              opacity: particleOpacity,
              filter: 'blur(10px)',
              transform: `scale(${particleScale})`,
            }}
          />
        );
      })}
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 100,
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontSize: 48,
          color: colors.text,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
        }}>
          Evaporation
        </h2>
        <p style={{
          fontSize: 24,
          color: colors.text,
          marginTop: 10,
          maxWidth: 500,
        }}>
          Solar energy heats water, turning it into water vapor
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Condensation Scene
const CondensationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, #4A90E2, ${colors.sky})` }}>
      {/* Clouds forming */}
      <Cloud x={200} y={150} delay={0} />
      <Cloud x={500} y={100} scale={1.2} delay={20} />
      <Cloud x={800} y={180} scale={0.9} delay={40} />
      
      {/* Water vapor particles condensing */}
      {[...Array(15)].map((_, i) => {
        const startX = 100 + i * 80;
        const startY = 400 - i * 10;
        
        const x = interpolate(
          frame - i * 3,
          [0, 60],
          [startX, 400 + Math.sin(i) * 100],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        const y = interpolate(
          frame - i * 3,
          [0, 60],
          [startY, 150 + Math.cos(i) * 50],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        const size = interpolate(
          frame - i * 3,
          [0, 60],
          [20, 5],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'rgba(240, 240, 240, 0.8)',
              filter: 'blur(2px)',
            }}
          />
        );
      })}
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 100,
        transform: `scale(${titleScale})`,
      }}>
        <h2 style={{
          fontSize: 48,
          color: colors.white,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          Condensation
        </h2>
        <p style={{
          fontSize: 24,
          color: colors.white,
          marginTop: 10,
          maxWidth: 600,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}>
          Water vapor cools and forms clouds as tiny droplets
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Precipitation Scene
const PrecipitationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleOpacity = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });
  
  // Lightning effect
  const lightningOpacity = frame % 90 > 85 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, #4A5568, #718096)` }}>
      {/* Lightning flash */}
      {lightningOpacity > 0 && (
        <AbsoluteFill style={{
          background: 'rgba(255,255,255,0.8)',
          opacity: lightningOpacity,
          pointerEvents: 'none',
        }} />
      )}
      
      {/* Dark clouds with more detail */}
      <div style={{ filter: 'brightness(0.7)' }}>
        <Cloud x={150} y={50} scale={1.3} />
        <Cloud x={450} y={30} scale={1.5} />
        <Cloud x={750} y={80} scale={1.2} />
        <Cloud x={300} y={100} scale={1.1} />
        <Cloud x={600} y={70} scale={1.4} />
      </div>
      
      {/* Rain drops with varying speeds */}
      {[...Array(30)].map((_, i) => (
        <WaterDrop
          key={i}
          x={50 + i * 60}
          delay={i * 2 + random(i) * 10}
        />
      ))}
      
      {/* Heavy rain effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(70, 130, 180, 0.1) 2px,
          rgba(70, 130, 180, 0.1) 4px
        )`,
        pointerEvents: 'none',
      }} />
      
      {/* Ground with puddles */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        background: colors.ground,
      }}>
        <div style={{
          width: '100%',
          height: 30,
          background: colors.grass,
        }} />
        
        {/* Puddles */}
        {[...Array(5)].map((_, i) => {
          const puddleScale = interpolate(
            frame - i * 20,
            [0, 40],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: 10,
                left: 100 + i * 300,
                width: 100 * puddleScale,
                height: 20 * puddleScale,
                background: colors.rain,
                borderRadius: '50%',
                opacity: 0.6,
              }}
            />
          );
        })}
      </div>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 100,
        transform: 'translateY(-50%)',
        opacity: titleOpacity,
      }}>
        <h2 style={{
          fontSize: 48,
          color: colors.white,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          Precipitation
        </h2>
        <p style={{
          fontSize: 24,
          color: colors.white,
          marginTop: 10,
          maxWidth: 500,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}>
          Water falls back to Earth as rain, snow, or hail
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Collection Scene
const CollectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const riverFlow = interpolate(
    frame,
    [0, 120],
    [0, -200],
  );
  
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${colors.sky}, #E6F3FF)` }}>
      <Sun scale={0.8} />
      
      {/* Mountains */}
      <div style={{
        position: 'absolute',
        bottom: 200,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '300px solid transparent',
        borderRight: '300px solid transparent',
        borderBottom: '400px solid #8B7355',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 200,
        left: 400,
        width: 0,
        height: 0,
        borderLeft: '250px solid transparent',
        borderRight: '250px solid transparent',
        borderBottom: '350px solid #A0826D',
      }} />
      
      {/* River */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 200,
        background: colors.ocean,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '200%',
          height: '100%',
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.1) 50px,
            rgba(255,255,255,0.1) 100px
          )`,
          transform: `translateX(${riverFlow}px)`,
        }} />
      </div>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 100,
        right: 100,
        textAlign: 'right',
        transform: `scale(${titleScale})`,
      }}>
        <h2 style={{
          fontSize: 48,
          color: colors.text,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
        }}>
          Collection
        </h2>
        <p style={{
          fontSize: 24,
          color: colors.text,
          marginTop: 10,
          maxWidth: 500,
        }}>
          Water flows into rivers, lakes, and oceans,<br />
          ready to begin the cycle again
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Human Impact Scene
const HumanImpactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  const impacts = [
    { icon: '🏭', title: 'Climate Change', desc: 'Rising temperatures alter the cycle' },
    { icon: '🌳', title: 'Deforestation', desc: 'Reduces transpiration and rainfall' },
    { icon: '🏙️', title: 'Urbanization', desc: 'Prevents natural water infiltration' },
    { icon: '🚜', title: 'Agriculture', desc: 'Heavy water use affects groundwater' },
  ];
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        transform: `scale(${titleScale})`,
        textAlign: 'center',
        maxWidth: 1400,
      }}>
        <h2 style={{
          fontSize: 56,
          color: colors.white,
          fontWeight: 'bold',
          marginBottom: 20,
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        }}>
          Human Impact on the Water Cycle
        </h2>
        
        <p style={{
          fontSize: 28,
          color: colors.white,
          marginBottom: 60,
          opacity: 0.9,
        }}>
          Our activities significantly affect this natural process
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 30,
          margin: '0 auto',
        }}>
          {impacts.map((impact, i) => {
            const itemOpacity = interpolate(
              frame - i * 15,
              [0, 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            
            const itemX = interpolate(
              frame - i * 15,
              [0, 20],
              [i % 2 === 0 ? -50 : 50, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            
            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 20,
                  padding: 30,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ fontSize: 48 }}>{impact.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 24,
                    color: colors.white,
                    marginBottom: 5,
                    fontWeight: 'bold',
                  }}>
                    {impact.title}
                  </h3>
                  <p style={{
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    {impact.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Summary Scene
const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  
  // Rotating cycle diagram
  const rotation = interpolate(
    frame,
    [0, 300],
    [0, 360],
  );
  
  const itemDelay = 20;
  const steps = [
    { icon: '☀️', text: 'Evaporation', desc: 'Sun heats water', angle: 0 },
    { icon: '☁️', text: 'Condensation', desc: 'Vapor forms clouds', angle: 90 },
    { icon: '🌧️', text: 'Precipitation', desc: 'Water falls as rain', angle: 180 },
    { icon: '🌊', text: 'Collection', desc: 'Water returns to sources', angle: 270 },
  ];
  
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at center, ${colors.sky}, #4A90E2)`,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
        <h2 style={{
          fontSize: 56,
          color: colors.white,
          fontWeight: 'bold',
          marginBottom: 80,
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        }}>
          The Never-Ending Water Cycle
        </h2>
        
        {/* Circular diagram */}
        <div style={{
          position: 'relative',
          width: 500,
          height: 500,
          margin: '0 auto',
        }}>
          {/* Center circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 150,
            height: 150,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 60,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}>
            💧
          </div>
          
          {/* Rotating arrows */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${rotation}deg)`,
          }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 250,
                  height: 2,
                  background: 'rgba(255,255,255,0.3)',
                  transform: `translate(-50%, -50%) rotate(${i * 90 + 45}deg)`,
                  transformOrigin: 'center',
                }}
              >
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: -5,
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid rgba(255,255,255,0.3)',
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                }} />
              </div>
            ))}
          </div>
          
          {/* Step items */}
          {steps.map((step, i) => {
            const itemOpacity = interpolate(
              frame - i * itemDelay,
              [0, 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            
            const radius = 200;
            const angleRad = (step.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  opacity: itemOpacity,
                }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 20,
                  padding: 20,
                  width: 140,
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 5 }}>{step.icon}</div>
                  <h4 style={{
                    fontSize: 18,
                    color: colors.text,
                    fontWeight: 'bold',
                  }}>
                    {step.text}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
        
        <p style={{
          fontSize: 28,
          color: colors.white,
          marginTop: 60,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          A continuous process essential for all life on Earth
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Main Water Cycle Component
export const WaterCycleAnimation: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <TitleScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 } })}
      />
      
      <TransitionSeries.Sequence durationInFrames={120}>
        <EvaporationScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-bottom' })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      
      <TransitionSeries.Sequence durationInFrames={120}>
        <CondensationScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 } })}
      />
      
      <TransitionSeries.Sequence durationInFrames={120}>
        <PrecipitationScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: 30 })}
      />
      
      <TransitionSeries.Sequence durationInFrames={120}>
        <CollectionScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={springTiming({ config: { damping: 200 } })}
      />
      
      <TransitionSeries.Sequence durationInFrames={120}>
        <HumanImpactScene />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 } })}
      />
      
      <TransitionSeries.Sequence durationInFrames={150}>
        <SummaryScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export function Main2() {
  return (
    <Composition
      id="WaterCycle"
      component={WaterCycleAnimation}
      durationInFrames={870}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}


registerRoot(Main2);
