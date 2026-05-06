import { useCurrentFrame, interpolate, AbsoluteFill, Easing } from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOutStart = 46;
  const opacity = interpolate(frame, [0, 45, fadeOutStart, 90], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = interpolate(frame, [0, 45], [0.8, 1], {
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
      }}
    >
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <h1
          style={{
            fontSize: 120,
            fontWeight: 800,
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Gray Weather
        </h1>
        <p
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          Aplicativo Moderno de Previsão do Tempo
        </p>
      </div>
    </AbsoluteFill>
  );
};
