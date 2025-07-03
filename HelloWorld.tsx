import { Composition } from 'remotion';
import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { registerRoot } from 'remotion';
const title: React.CSSProperties = {
	fontFamily: 'sans-serif',
	fontWeight: 'bold',
	fontSize: 100,
	textAlign: 'center',
	position: 'absolute',
	bottom: '160px',
	width: '100%',
};

const word: React.CSSProperties = {
	marginLeft: 10,
	marginRight: 10,
	display: 'inline-block',
};

export const HelloWorld: React.FC<{
	titleText: string;
	titleColor: string;
}> = ({ titleText, titleColor }) => {
	const frame = useCurrentFrame();

	const words = titleText.split(' ');

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<div style={{ ...title, color: titleColor }}>
				{words.map((t, i) => {
					const delay = i * 5;

					const scale = spring({
						fps: 30,
						frame: frame - delay,
						config: {
							damping: 200,
						},
					});

					return (
						<span
							key={t}
							style={{
								...word,
								transform: `scale(${scale})`,
							}}
						>
							{t}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
}; 

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Hello, World!',
          titleColor: 'black',
        }}
      />
    </>
  );
};
registerRoot(RemotionRoot);
