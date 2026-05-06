import { Composition, registerRoot } from "remotion";
import { AppDemoVideo } from "./AppDemoVideo";

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AppDemoVideo"
        component={AppDemoVideo}
        durationInFrames={1000}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
