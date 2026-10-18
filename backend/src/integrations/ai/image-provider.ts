import type { ImageGenerationProvider } from "./ai.interface.js";
import { MockImageProvider } from "./mock-image.provider.js";

const providerName = process.env.IMAGE_GENERATION_PROVIDER || "mock";

let provider: ImageGenerationProvider;

if (providerName === "mock") {
  provider = new MockImageProvider();
} else {
  throw new Error(`Unsupported image provider: ${providerName}`);
}

console.log("IMAGE GENERATION PROVIDER:", providerName);

export default provider;
