import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface SceneProps {
  frame: number;
  duration: number;
}

export const TechStackScene: React.FC<SceneProps> = ({ frame, duration }) => {
  const fadeOutStart = Math.max(31, duration - 30);
  const opacity = interpolate(frame, [0, 30, fadeOutStart, duration], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const backendItems = [
    { label: "Node.js", color: "#68a063" },
    { label: "Fastify", color: "#000000" },
    { label: "TypeScript", color: "#3178c6" },
    { label: "Vitest", color: "#729b1b" },
  ];

  const frontendItems = [
    { label: "Vue 3", color: "#42b883" },
    { label: "Vite", color: "#646cff" },
    { label: "Tailwind", color: "#38bdf8" },
    { label: "PWA", color: "#ff9800" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ opacity, width: "100%" }}>
        <h2
          style={{
            fontSize: 64,
            color: "#fff",
            marginBottom: 60,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Tecnologias Utilizadas
        </h2>

        <div style={{ display: "flex", gap: 80 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 40, color: "#60a5fa", marginBottom: 30 }}>Backend</h3>
            {backendItems.map((item, i) => {
              const itemOpacity = interpolate(frame, [30 + i * 20, 70 + i * 20], [0, 1], {
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={item.label}
                  style={{
                    opacity: itemOpacity,
                    marginBottom: 20,
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      color: item.color,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 40, color: "#a78bfa", marginBottom: 30 }}>Frontend</h3>
            {frontendItems.map((item, i) => {
              const itemOpacity = interpolate(frame, [110 + i * 20, 150 + i * 20], [0, 1], {
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={item.label}
                  style={{
                    opacity: itemOpacity,
                    marginBottom: 20,
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      color: item.color,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
