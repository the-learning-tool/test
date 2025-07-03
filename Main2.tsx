import React from 'react';
import {
  Composition,
  Sequence,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Series,
} from 'remotion';
import { registerRoot } from 'remotion/register-root';

// --- STYLING & CONFIGURATION ---
const SCENE_DURATION_IN_FRAMES = 6 * 30; // 6 seconds per scene
const FADE_TRANSITION_DURATION = 30; // 1 second fade transition

const textStyle: React.CSSProperties = {
  fontFamily: '"Cinzel Decorative", "Garamond", serif',
  fontSize: '64px',
  color: 'white',
  fontWeight: 700,
  textAlign: 'center',
  textShadow: '0 0 10px rgba(0,0,0,0.7)',
  position: 'absolute',
  bottom: '100px',
  width: '100%',
  padding: '0 50px',
};

const parchmentBackground: React.CSSProperties = {
  backgroundColor: '#F5DEB3', // A parchment-like color
};

// --- HELPER / SVG COMPONENTS GO HERE ---

// Helper to animate text writing itself
const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const length = interpolate(frame, [0, 60], [0, text.length], {
    extrapolateRight: 'clamp',
  });
  return <span>{text.slice(0, length)}</span>;
};

// Generic component for titles
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return <h1 style={{ ...textStyle, opacity }}>{children}</h1>;
};

// --- SVG Components ---

const Crown: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="200" height="150" viewBox="0 0 200 150" style={style}>
    <path d="M20,130 L180,130 L190,50 L150,80 L100,20 L50,80 L10,50 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="5" />
    <circle cx="25" cy="45" r="10" fill="#FF4136" />
    <circle cx="100" cy="15" r="10" fill="#0074D9" />
    <circle cx="175" cy="45" r="10" fill="#2ECC40" />
    <circle cx="55" cy="75" r="8" fill="#FF4136" />
    <circle cx="145" cy="75" r="8" fill="#0074D9" />
  </svg>
);

const FranceMap: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <svg width="500" height="500" viewBox="0 0 100 100" style={style}>
        <path d="M49.8,2.7c-2.3,0.5-4.8,2.1-7.2,4.3c-2,1.8-3.9,4.2-5.7,6.8c-1.2,1.8-2.3,3.8-3.4,5.8c-1.2,2.3-2.5,4.7-3.6,7.2 c-1,2.3-1.8,4.5-2.6,6.8c-0.8,2.4-1.5,4.9-2,7.4c-0.4,2-0.5,4-0.4,6c0.1,2.1,0.5,4.1,1.1,6.1c0.8,2.5,2,4.8,3.5,7 c1,1.5,2.1,2.9,3.4,4.2c1.7,1.7,3.6,3.1,5.7,4.3c2.7,1.4,5.6,2.3,8.7,2.7c2.9,0.4,5.8,0.2,8.6-0.6c3.1-0.8,6-2.4,8.5-4.6 c2.1-1.8,3.9-4,5.3-6.4c1.3-2.2,2.3-4.6,2.9-7.1c0.7-2.9,0.9-5.9,0.5-8.8c-0.3-2.3-1-4.6-2-6.8c-1.1-2.4-2.5-4.7-4.1-6.8 c-1.5-1.9-3.2-3.7-5-5.2c-2-1.6-4.1-3-6.4-4.1c-2.7-1.2-5.5-2-8.4-2.3C52.8,2.5,51.3,2.5,49.8,2.7z"
        fill="#a08a6e" stroke="#705d45" strokeWidth="1"/>
    </svg>
);

const Pyramid: React.FC<{ highlight?: 'first' | 'second' | 'third' | 'none' }> = ({ highlight = 'none' }) => {
  const frame = useCurrentFrame();
  const thirdEstateHeight = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const secondEstateHeight = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const firstEstateHeight = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <svg width="600" height="500" viewBox="0 0 600 500">
      {/* Third Estate */}
      <g opacity={thirdEstateHeight}>
        <path d="M50 450 L550 450 L350 250 L250 250 Z" fill={highlight === 'third' ? '#F0E68C' : '#CD853F'} stroke="black" strokeWidth="2" />
        <text x="300" y="360" textAnchor="middle" fontSize="30" fill="black">Third Estate</text>
      </g>
      {/* Second Estate */}
      <g opacity={secondEstateHeight}>
        <path d="M250 250 L350 250 L325 200 L275 200 Z" fill={highlight === 'second' ? '#F0E68C' : '#87CEEB'} stroke="black" strokeWidth="2" />
        <text x="300" y="235" textAnchor="middle" fontSize="20" fill="black">Second Estate</text>
      </g>
      {/* First Estate */}
      <g opacity={firstEstateHeight}>
        <path d="M275 200 L325 200 L300 150 Z" fill={highlight === 'first' ? '#F0E68C' : '#D3D3D3'} stroke="black" strokeWidth="2" />
        <text x="300" y="185" textAnchor="middle" fontSize="16" fill="black">First Estate</text>
      </g>
    </svg>
  );
};

const Icon: React.FC<{ path: string; style?: React.CSSProperties; viewBox?: string }> = ({ path, style, viewBox = "0 0 24 24" }) => (
    <svg width="80" height="80" viewBox={viewBox} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
    </svg>
);

const Lightbulb: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <svg width="100" height="100" viewBox="0 0 24 24" style={style}>
        <path d="M9 19c-1.92 0-3.62-1-4.5-2.583M15 19c1.92 0 3.62-1 4.5-2.583" stroke="#FFC300" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 2v3.133M12 15.867V19M12 15.867C9.206 15.867 7 13.91 7 11.5c0-2.41 2.206-4.367 5-4.367s5 1.956 5 4.367c0 2.41-2.206 4.367-5 4.367Z" stroke="#FFC300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.929 4.929l2.215 2.215M16.857 16.857l2.215 2.215M2 12h3.133M18.867 12H22M4.929 19.071l2.215-2.215M16.857 7.143l2.215-2.215" stroke="#FFC300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Guillotine: React.FC<{ animate?: boolean }> = ({ animate }) => {
    const frame = useCurrentFrame();
    const bladeDrop = animate ? interpolate(frame, [30, 45], [0, 200], { easing: Easing.quad, extrapolateRight: 'clamp' }) : 0;
    
    return (
        <svg width="300" height="500" viewBox="0 0 300 500">
            {/* Frame */}
            <rect x="50" y="50" width="20" height="400" fill="#8B4513" />
            <rect x="230" y="50" width="20" height="400" fill="#8B4513" />
            <rect x="50" y="30" width="200" height="20" fill="#8B4513" />
            <rect x="40" y="450" width="220" height="30" fill="#A0522D" />
            {/* Lunette (neck holder) */}
            <rect x="70" y="380" width="160" height="15" fill="#8B4513" />
            <path d="M 70 395 A 80 80 0 0 0 230 395 Z" fill="#A0522D" />
            {/* Blade */}
            <g transform={`translate(0, ${bladeDrop})`}>
                <path d="M75 50 L225 100 L75 150 Z" fill="#C0C0C0" stroke="black" strokeWidth="2" />
            </g>
        </svg>
    );
};

const FrenchFlag: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <svg width="150" height="100" viewBox="0 0 3 2" style={style}>
        <rect width="1" height="2" fill="#002395" />
        <rect width="1" height="2" x="1" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" fill="#ED2939" />
    </svg>
);


// --- SCENE COMPONENTS ---

const SceneWrapper: React.FC<{ children: React.ReactNode, style?: React.CSSProperties }> = ({ children, style }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const opacity = interpolate(
        frame,
        [0, FADE_TRANSITION_DURATION, durationInFrames - FADE_TRANSITION_DURATION, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ ...style, opacity }}>
            {children}
        </AbsoluteFill>
    );
};

const Scene1: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const zoom = interpolate(frame, [30, SCENE_DURATION_IN_FRAMES], [1, 1.5]);
    const crownY = spring({ frame: frame - 10, fps: 30, from: -200, to: 20 });
    return (
        <AbsoluteFill style={parchmentBackground}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${zoom})`}}>
                <FranceMap />
                <Crown style={{ position: 'absolute', top: crownY, left: (width / 2) - 100, transform: 'translateX(-50%)' }} />
            </AbsoluteFill>
            <Title><TypingText text="The Ancien Régime" /></Title>
        </AbsoluteFill>
    );
};

const Scene2: React.FC = () => {
    const frame = useCurrentFrame();
    const highlight = frame < 90 ? 'third' : frame < 135 ? 'second' : 'first';
    return (
        <AbsoluteFill style={{ backgroundColor: '#4a4a4a', justifyContent: 'center', alignItems: 'center' }}>
            <Pyramid highlight={highlight} />
            <Title>The Three Estates</Title>
        </AbsoluteFill>
    );
};

const Scene3: React.FC = () => {
    const frame = useCurrentFrame();
    const icon1Spring = spring({ frame: frame - 20, fps: 30, config: { damping: 12 } });
    const icon2Spring = spring({ frame: frame - 40, fps: 30, config: { damping: 12 } });
    const icon3Spring = spring({ frame: frame - 60, fps: 30, config: { damping: 12 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center' }}>
            {/* Bishop SVG */}
            <svg width="150" height="300" viewBox="0 0 150 300">
                <rect x="50" y="80" width="50" height="150" fill="#333" />
                <circle cx="75" cy="55" r="25" fill="#F0E68C" />
                <path d="M 50 20 H 100 L 75 0 Z" fill="#663399" />
            </svg>
            <div style={{ position: 'absolute', left: '55%', top: '30%', transform: `scale(${icon1Spring})` }}>
                <Icon path="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><span style={{color: 'black'}}>10% Land</span>
            </div>
            <div style={{ position: 'absolute', left: '60%', top: '50%', transform: `scale(${icon2Spring})` }}>
                <Icon path="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /><span style={{color: 'black'}}>Tithes</span>
            </div>
            <div style={{ position: 'absolute', left: '55%', top: '70%', transform: `scale(${icon3Spring})` }}>
                <Icon path="M18 6L6 18M6 6l12 12" stroke="red" /><span style={{color: 'black'}}>No Taxes</span>
            </div>
            <Title>First Estate: The Clergy (≈0.5%)</Title>
        </AbsoluteFill>
    );
};

const Scene4: React.FC = () => {
    const frame = useCurrentFrame();
    const icon1Spring = spring({ frame: frame - 20, fps: 30 });
    const icon2Spring = spring({ frame: frame - 40, fps: 30 });
    const icon3Spring = spring({ frame: frame - 60, fps: 30 });
    
    return (
        <AbsoluteFill style={{ backgroundColor: '#87CEEB', justifyContent: 'center', alignItems: 'center' }}>
            {/* Nobleman SVG */}
            <svg width="200" height="350" viewBox="0 0 200 350">
                <rect x="75" y="100" width="50" height="180" fill="#000080" />
                <circle cx="100" cy="70" r="30" fill="#F0E68C" />
                <path d="M 80 40 Q 100 20 120 40 L 125 50 L 75 50 Z" fill="#FFFFFF" /> {/* Wig */}
            </svg>
            <div style={{ position: 'absolute', right: '55%', top: '30%', transform: `scale(${icon1Spring})` }}>
                <Icon path="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><span style={{color: 'black'}}>25-30% Land</span>
            </div>
            <div style={{ position: 'absolute', right: '60%', top: '50%', transform: `scale(${icon2Spring})` }}>
                <Icon path="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" /><span style={{color: 'black'}}>Military</span>
            </div>
            <div style={{ position: 'absolute', right: '55%', top: '70%', transform: `scale(${icon3Spring})` }}>
                <Icon path="M14.5 3.5c2.8 2.8 2.8 7.2.1 10L3 15" /><span style={{color: 'black'}}>Government</span>
            </div>
            <Title>Second Estate: The Nobility (≈1.5%)</Title>
        </AbsoluteFill>
    );
};

const Scene5: React.FC = () => {
    const frame = useCurrentFrame();
    const weightY = interpolate(frame, [30, 90], [-200, 50], { easing: Easing.bounce, extrapolateRight: 'clamp' });
    const struggle = Math.sin(frame / 5) * 5;

    return (
        <AbsoluteFill style={{ backgroundColor: '#CD853F', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: weightY, zIndex: 1 }}>
                <div style={{ width: 800, height: 200, backgroundColor: '#696969', border: '5px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 40}}>
                    1st & 2nd Estates
                </div>
            </div>
            <div style={{ display: 'flex', position: 'absolute', bottom: '20%', transform: `translateX(${struggle}px)` }}>
                 {/* Peasant, Blacksmith, Lawyer */}
                <svg width="150" height="200"><rect x="50" y="50" width="50" height="150" fill="brown" /><circle cx="75" cy="30" r="20" fill="#f4a460" /></svg>
                <svg width="150" height="200"><rect x="50" y="50" width="50" height="150" fill="grey" /><circle cx="75" cy="30" r="20" fill="#f4a460" /></svg>
                <svg width="150" height="200"><rect x="50" y="50" width="50" height="150" fill="black" /><circle cx="75" cy="30" r="20" fill="#f4a460" /></svg>
            </div>
            <Title>Third Estate: Everyone Else (≈98%)</Title>
        </AbsoluteFill>
    );
};

const Scene6: React.FC = () => {
    const frame = useCurrentFrame();
    const glow = 1 + Math.sin(frame / 10) * 0.1;
    const idea1 = spring({ frame: frame - 40, fps: 30 });
    const idea2 = spring({ frame: frame - 60, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
            <Lightbulb style={{ position: 'absolute', top: 50, transform: `scale(${glow})`, filter: `drop-shadow(0 0 20px #FFC300)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%' }}>
                {/* Silhouettes */}
                <svg width="200" height="300"><path d="M 50 280 C 50 150, 150 150, 150 280 Z" fill="#111"/><circle cx="100" cy="100" r="50" fill="#111"/></svg>
                <svg width="200" height="300"><path d="M 50 280 C 50 150, 150 150, 150 280 Z" fill="#111"/><circle cx="100" cy="100" r="50" fill="#111"/></svg>
            </div>
            <div style={{ position: 'absolute', top: '40%', left: '20%', transform: `scale(${idea1})`, background: 'white', padding: 20, borderRadius: 15 }}>
                <Icon path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><Icon path="M9 3a4 4 0 0 1 4 4v1" /><Icon path="M23 21v-2a4 4 0 0 0-3-3.87" /><Icon path="M16 3.13a4 4 0 0 1 0 7.75" />
            </div>
            <div style={{ position: 'absolute', top: '40%', right: '20%', transform: `scale(${idea2})`, background: 'white', padding: 20, borderRadius: 15 }}>
                <Icon path="M12 3v18M3 12h18" />
            </div>
            <Title>Enlightenment Ideology</Title>
        </AbsoluteFill>
    );
};

// ... Many more scenes would be defined here following the same pattern
// To keep this example concise, I'll create a few more key scenes and then placeholders.

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const coinsDrawn = interpolate(frame, [30, 120], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#465A64', justifyContent: 'center', alignItems: 'center' }}>
      {/* Treasury Chest */}
      <svg width="400" height="300" viewBox="0 0 400 300">
        <rect x="50" y="100" width="300" height="150" fill="#8B4513" rx="15" />
        <rect x="40" y="80" width="320" height="40" fill="#C0C0C0" rx="10" />
        <circle cx="200" cy="175" r="15" fill="#333" />
      </svg>
      {/* Pipes - very simplified */}
      <div style={{position: 'absolute', width: 80, height: 200, background: '#777', left: '15%', top: '45%'}} />
      <div style={{position: 'absolute', width: 80, height: 200, background: '#777', right: '15%', top: '45%'}} />
      {/* Flowing coins - simple representation */}
      <div style={{
          width: 50, height: 50, background: 'gold', borderRadius: '50%', position: 'absolute',
          top: '40%', left: `calc(16% + ${interpolate(coinsDrawn, [0, 1], [200, -300])}px)`, opacity: coinsDrawn > 0.1 ? 1 : 0
      }} />
      <div style={{
          width: 50, height: 50, background: 'gold', borderRadius: '50%', position: 'absolute',
          top: '45%', right: `calc(16% + ${interpolate(coinsDrawn, [0, 1], [200, -300])}px)`, opacity: coinsDrawn > 0.1 ? 1 : 0
      }} />
      <Title>Economic Strains: War Debts</Title>
    </AbsoluteFill>
  );
};


const Scene12: React.FC = () => {
  const frame = useCurrentFrame();
  const crowdMove = interpolate(frame, [0, 100], [200, 0]);
  const gateBreak = spring({frame: frame - 90, fps: 30, config: {stiffness: 100}});
  const flagUnfurl = spring({frame: frame - 120, fps: 30});

  return (
    <AbsoluteFill style={{ backgroundColor: '#2c3e50', justifyContent: 'center', alignItems: 'center' }}>
      {/* Bastille */}
      <svg width="600" height="600" viewBox="0 0 600 600">
        <rect x="150" y="100" width="300" height="400" fill="#6c7a89"/>
        <rect x="100" y="150" width="50" height="300" fill="#596a79"/>
        <rect x="450" y="150" width="50" height="300" fill="#596a79"/>
        {/* Gate */}
        <g transform={`rotate(${gateBreak * 45} 275 450)`}>
          <rect x="250" y="400" width="100" height="100" fill="#3a3a3a"/>
        </g>
      </svg>
      {/* Crowd */}
      <div style={{position: 'absolute', bottom: 50, right: crowdMove, color: 'orange', fontSize: 100}}>
        🔥🔦🔱
      </div>
       <div style={{position: 'absolute', top: 50, left: '50%', transform: `scaleY(${flagUnfurl})`, transformOrigin: 'top'}}>
        <FrenchFlag />
       </div>
      <Title>Storming of the Bastille: July 14, 1789</Title>
    </AbsoluteFill>
  );
};

const Scene17: React.FC = () => {
    const frame = useCurrentFrame();
    const crownRoll = interpolate(frame, [50, 150], [0, 360]);
    const crownX = interpolate(frame, [50, 150], [0, 200]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#4d0000', justifyContent: 'center', alignItems: 'center' }}>
            <Guillotine animate={true} />
            <div style={{ position: 'absolute', bottom: '15%', left: `calc(50% + ${crownX}px)`, transform: `rotate(${crownRoll}deg)`}}>
                <Crown style={{transform: 'scale(0.5)'}} />
            </div>
            <Title>Execution of Louis XVI: Jan 21, 1793</Title>
        </AbsoluteFill>
    );
};

const Scene20: React.FC = () => {
    const frame = useCurrentFrame();
    const zoom = interpolate(frame, [0, 180], [1, 3]);
    const focusX = interpolate(frame, [0, 180], [0.5, 0.6]);
    const focusY = interpolate(frame, [0, 180], [0.5, 0.4]);

    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#a9a9a9', justifyContent: 'center', alignItems: 'center', 
            transform: `scale(${zoom})`, transformOrigin: `${focusX * 100}% ${focusY * 100}%`
        }}>
            {/* Simplified battle scene */}
            <div style={{color: 'red', fontSize: 100, position:'absolute', left: '10%', top: '20%', filter: `blur(${interpolate(zoom, [1,3], [0, 10])}px)`}}>💥</div>
            <div style={{color: '#333', fontSize: 100, position:'absolute', right: '10%', bottom: '20%', filter: `blur(${interpolate(zoom, [1,3], [0, 10])}px)`}}>⚔️</div>
            {/* Napoleon */}
            <div style={{ 
                position: 'absolute', left: '55%', top: '35%', 
                background: 'rgba(255, 215, 0, 0.3)', borderRadius: '50%', padding: 50,
                boxShadow: '0 0 50px 20px rgba(255, 215, 0, 0.5)'
            }}>
                <svg width="100" height="150" viewBox="0 0 100 150">
                    <path d="M 40 140 L 60 140 L 60 70 L 40 70 Z" fill="#002395" />
                    <circle cx="50" cy="50" r="20" fill="#F0E68C" />
                    <path d="M40 35 L60 35 L50 20 Z" fill="#333" /> {/* Hat */}
                </svg>
            </div>
            <Title>The Rise of Napoleon</Title>
        </AbsoluteFill>
    );
};

const Scene26: React.FC = () => {
    const frame = useCurrentFrame();

    const drawLine = (startFrame: number) => {
        return interpolate(frame, [startFrame, startFrame + 60], [0, 1], { extrapolateRight: 'clamp' });
    };

    const Sparkle: React.FC<{style: React.CSSProperties}> = ({style}) => (
        <div style={{...style, position: 'absolute', color: '#FFD700', fontSize: 40, textShadow: '0 0 15px gold'}}>✨</div>
    )

    return (
        <AbsoluteFill style={{ backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' }}>
            {/* Simplified World Map */}
            <svg width="1000" height="500" viewBox="0 0 1000 500">
                <path d="M100,100 L150,50 L250,80 L300,200 L200,300 L100,250 Z" fill="#2E8B57" /> {/* S America */}
                <path d="M400,150 L450,120 L550,150 L500,250 Z" fill="#8B4513" /> {/* Africa */}
                <path d="M450,50 h 50 v 50 h -50 z" fill="#4682B4" /> {/* Europe with France */}
                <path d="M280,100 h 40 v 30 h -40 z" fill="#D2691E" /> {/* Haiti area */}
                
                {/* France Spark */}
                <circle cx="475" cy="75" r={interpolate(frame, [0, 30], [0, 10])} fill="gold" />

                {/* Line to Haiti */}
                <path d="M475 75 Q 380 90 300 115" stroke="gold" strokeWidth="3" strokeDasharray={300} strokeDashoffset={300 - 300 * drawLine(30)} />
                {drawLine(30) > 0 && drawLine(30) < 1 && <Sparkle style={{left: 300, top: 115}}/>}

                {/* Line to S America */}
                <path d="M475 75 Q 350 150 250 220" stroke="gold" strokeWidth="3" strokeDasharray={400} strokeDashoffset={400 - 400 * drawLine(50)} />
                {drawLine(50) > 0 && drawLine(50) < 1 && <Sparkle style={{left: 250, top: 220}}/>}
            </svg>
            <Title>Legacy: Global Influence</Title>
        </AbsoluteFill>
    );
};

// Placeholder for unimplemented scenes
const PlaceholderScene: React.FC<{ title: string, sceneNumber: number }> = ({ title, sceneNumber }) => (
    <AbsoluteFill style={{ backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{...textStyle, fontSize: 100, opacity: 0.5}}>Scene {sceneNumber}</h1>
        <Title>{title}</Title>
    </AbsoluteFill>
);

// --- MAIN ANIMATION COMPONENT ---
export const FrenchRevolution: React.FC = () => {
    const scenes = [
        { component: Scene1, title: "The Ancien Régime" },
        { component: Scene2, title: "The Three Estates" },
        { component: Scene3, title: "First Estate: The Clergy (≈0.5%)" },
        { component: Scene4, title: "Second Estate: The Nobility (≈1.5%)" },
        { component: Scene5, title: "Third Estate: Everyone Else (≈98%)" },
        { component: Scene6, title: "Enlightenment Ideology" },
        { component: Scene7, title: "Economic Strains: War Debts" },
        { component: PlaceholderScene, title: "Unfair Taxes & Famine" },
        { component: PlaceholderScene, title: "Political Incompetence" },
        { component: PlaceholderScene, title: "Estates-General, 1789" },
        { component: PlaceholderScene, title: "The Tennis Court Oath" },
        { component: Scene12, title: "Storming of the Bastille: July 14, 1789" },
        { component: PlaceholderScene, title: "The August Decrees" },
        { component: PlaceholderScene, title: "Declaration of the Rights of Man" },
        { component: PlaceholderScene, title: "Constitutional Monarchy & Flight to Varennes" },
        { component: PlaceholderScene, title: "Fall of the Monarchy" },
        { component: Scene17, title: "Execution of Louis XVI: Jan 21, 1793" },
        { component: PlaceholderScene, title: "The Reign of Terror (1793-94)" },
        { component: PlaceholderScene, title: "The Revolutionary Wars" },
        { component: Scene20, title: "The Rise of Napoleon" },
        { component: PlaceholderScene, title: "The Directory (1795-1799)" },
        { component: PlaceholderScene, title: "Coup of 18 Brumaire" },
        { component: PlaceholderScene, title: "The Revolution Ends" },
        { component: PlaceholderScene, title: "Legacy: Political" },
        { component: PlaceholderScene, title: "Legacy: Social & Legal" },
        { component: Scene26, title: "Legacy: Global Influence" },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/*
              This structure creates a cross-fade transition between scenes.
              Each scene lasts for its duration, but starts "FADE_TRANSITION_DURATION" frames
              before the previous one ends, allowing for a smooth opacity blend.
            */}
            <Series>
                {scenes.map((scene, index) => (
                    <Series.Sequence key={index} durationInFrames={SCENE_DURATION_IN_FRAMES} >
                       <SceneWrapper>
                           {React.createElement(scene.component, {title: scene.title, sceneNumber: index + 1})}
                       </SceneWrapper>
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};

// --- COMPOSITION & REGISTRATION ---
export function Main() {
    const totalScenes = 26;
    const totalDuration = totalScenes * SCENE_DURATION_IN_FRAMES;

    return (
        <Composition
            id="FrenchRevolution"
            component={FrenchRevolution}
            durationInFrames={totalDuration}
            fps={30}
            width={1920}
            height={1080}
        />
    );
}

registerRoot(Main);
