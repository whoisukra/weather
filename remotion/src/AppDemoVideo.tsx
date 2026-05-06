import { Composition, Sequence, AbsoluteFill } from "remotion";
import { TitleScene } from "./components/TitleScene";
import { AppDemoScene } from "./components/AppDemoScene";
import { FeaturesScene } from "./components/FeaturesScene";
import { EndScene } from "./components/EndScene";

export const AppDemoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={90}>
        <TitleScene />
      </Sequence>
      <Sequence from={90} durationInFrames={360}>
        <AppDemoScene />
      </Sequence>
      <Sequence from={450} durationInFrames={400}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={850} durationInFrames={150}>
        <EndScene />
      </Sequence>
    </AbsoluteFill>
  );
};
