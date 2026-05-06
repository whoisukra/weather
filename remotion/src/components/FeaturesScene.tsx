import { useCurrentFrame, interpolate, AbsoluteFill, Easing } from "remotion";

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOutStart = 310;
  const opacity = interpolate(frame, [0, 50, fadeOutStart, 400], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const features = [
    { icon: "🌡️", title: "Clima em Tempo Real", desc: "Temperatura e condições atuais" },
    { icon: "📍", title: "Busca de Cidades", desc: "Geocodificação com histórico" },
    { icon: "🌙", title: "Modo Escuro/Claro", desc: "Tema com persistência" },
    { icon: "📊", title: "Gráficos e Previsão", desc: "Gráfico 12h e previsão 3 dias" },
    { icon: "📱", title: "PWA Ready", desc: "Suporte offline e cache" },
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
          Principais Funcionalidades
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 30,
          }}
        >
          {features.map((feature, i) => {
            // Cada card aparece a cada 50 frames (1.67s), com 80 frames (2.67s) de animação
            // Total para 5 cards: 40 + (4 * 50) + 80 = 320 frames
            const startFrame = 50 + i * 50;
            const endFrame = startFrame + 80;
            const itemOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
               extrapolateRight: "clamp",
               easing: Easing.bezier(0.16, 1, 0.3, 1),
             });
             const translateY = interpolate(frame, [startFrame, endFrame], [30, 0], {
               extrapolateRight: "clamp",
               easing: Easing.bezier(0.16, 1, 0.3, 1),
             });

            return (
              <div
                key={feature.title}
                style={{
                  opacity: itemOpacity,
                  transform: `translateY(${translateY}px)`,
                  padding: 30,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 28, color: "#fff", marginBottom: 8, fontWeight: 600 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
