import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type {
  GeneratedVideo,
  GenerateVideoParams,
  VideoGenerationProvider,
} from "../ai.interface.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MockVideoProvider implements VideoGenerationProvider {
  async generateVideo(
    _params: GenerateVideoParams
  ): Promise<GeneratedVideo> {
    // Simulate realistic AI video rendering latency (3.0 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const videoPath = path.join(
      __dirname,
      "../../assets/mock-video.mp4"
    );

    const buffer = await fs.readFile(videoPath);

    return {
      buffer,
      mimeType: "video/mp4",
    };
  }
}
