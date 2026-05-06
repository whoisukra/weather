import { useCurrentFrame, interpolate, AbsoluteFill, Easing } from "remotion";

export const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeInEnd = 30;
  const fadeOutStart = 135;

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, 150],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

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
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 30 }}>☀️</div>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 20,
          }}
        >
          Construído com Stack Moderna
        </h2>
        <p style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.7)", letterSpacing: 1 }}>
          Fastify + Vue 3 + TypeScript
        </p>
      </div>
    </AbsoluteFill>
  );
};
