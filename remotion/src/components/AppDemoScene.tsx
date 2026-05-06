import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Img, staticFile, Easing } from "remotion";

export const AppDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Show screenshots with transitions
  // 450 frames = 15 seconds for demo (5 screenshots x 3 seconds each)
  const screenshotDuration = 90; // 3 seconds per screenshot
  const screenshots = [
    { file: "1-initial.png", label: "Estado Inicial" },
    { file: "2-search-open.png", label: "Modal de Busca Aberto" },
    { file: "3-searching.png", label: "Pesquisando Cidade..." },
    { file: "4-weather.png", label: "Clima Exibido" },
    { file: "6-final.png", label: "Visualização Final" },
  ];

  const currentIndex = Math.min(Math.floor(frame / screenshotDuration), screenshots.length - 1);
  const progress = (frame % screenshotDuration) / screenshotDuration;

  const screenshot = screenshots[currentIndex];
  const imagePath = staticFile(screenshot.file);

  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(progress, [0, 0.2], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 40,
      }}
    >
      {/* Screenshot display */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "2px solid rgba(255,255,255,0.1)",
          maxWidth: "85%",
          maxHeight: "75%",
        }}
      >
        <Img
          src={imagePath}
          alt={screenshot.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 30,
          padding: "12px 32px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 30,
          backdropFilter: "blur(10px)",
        }}
      >
        <span
          style={{
            fontSize: 28,
            color: "#fff",
            fontWeight: 500,
          }}
        >
          {screenshot.label}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          right: 80,
          height: 4,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
        }}
      >
         <div
           style={{
            width: `${interpolate(frame, [0, 360], [0, 100])}%`,
              height: "100%",
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              borderRadius: 2,
           }}
         />
      </div>
    </AbsoluteFill>
  );
};
