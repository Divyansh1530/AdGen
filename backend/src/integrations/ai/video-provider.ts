import type { VideoGenerationProvider } from "./ai.interface.js";
import { MockVideoProvider } from "./mock-video.provider.js";

const providerName = process.env.VIDEO_GENERATION_PROVIDER || "mock";

let provider: VideoGenerationProvider;

if (providerName === "mock") {
  provider = new MockVideoProvider();
} else {
  throw new Error(`Unsupported video provider: ${providerName}`);
}

export default provider;
