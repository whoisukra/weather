import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface SceneProps {
  frame: number;
  duration: number;
}

export const CodeScene: React.FC<SceneProps> = ({ frame, duration }) => {
  const fadeOutStart = Math.max(31, duration - 30);
  const opacity = interpolate(frame, [0, 30, fadeOutStart, duration], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const codeLines = [
    { text: "src/modules/weather/", color: "#60a5fa", indent: 0 },
    { text: "├── weather.routes.ts", color: "#a78bfa", indent: 1 },
    { text: "├── weather.controller.ts", color: "#a78bfa", indent: 1 },
    { text: "├── weather.service.ts", color: "#a78bfa", indent: 1 },
    { text: "├── weather.types.ts", color: "#a78bfa", indent: 1 },
    { text: "└── weather.errors.ts", color: "#a78bfa", indent: 1 },
    { text: "", color: "#fff", indent: 0 },
    { text: "✓ Arquitetura baseada em features", color: "#4ade80", indent: 0 },
    { text: "✓ Injeção de dependência", color: "#4ade80", indent: 0 },
    { text: "✓ Totalmente tipado", color: "#4ade80", indent: 0 },
    { text: "✓ Cobertura completa de testes", color: "#4ade80", indent: 0 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      <div style={{ opacity, width: "100%" }}>
        <h2
          style={{
            fontSize: 64,
            color: "#fff",
            marginBottom: 50,
            textAlign: "center",
            fontWeight: 700,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Arquitetura Limpa
        </h2>

        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            borderRadius: 16,
            padding: 40,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {codeLines.map((line, i) => {
            const lineOpacity = interpolate(frame, [30 + i * 15, 70 + i * 15], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  marginBottom: 12,
                  paddingLeft: `${line.indent * 30}px`,
                }}
              >
                <span style={{ fontSize: 24, color: line.color, fontFamily: "monospace" }}>
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
