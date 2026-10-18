import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import type {
  GeneratedImage,
  ImageGenerationProvider,
} from "../ai.interface.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MockImageProvider implements ImageGenerationProvider {
  async generateImages(): Promise<GeneratedImage[]> {
    // Simulate realistic AI generation latency (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const imagePaths = [
      path.join(__dirname, "../../assets/mock-image-1.png"),
      path.join(__dirname, "../../assets/mock-image-2.png"),
      path.join(__dirname, "../../assets/mock-image-3.png"),
    ];

    const images: GeneratedImage[] = [];

    for (const imagePath of imagePaths) {
      const buffer = await fs.readFile(imagePath);
      images.push({
        buffer,
        mimeType: "image/png",
      });
    }
    return images;
  }
}
