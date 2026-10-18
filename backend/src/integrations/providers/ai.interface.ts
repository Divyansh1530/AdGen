export interface GenerateImageParams {
  productImageUrl: string;
  modelImageUrl: string;
  productName: string;
  productDescription?: string | null;
  userPrompt?: string | null;
  aspectRatio: string;
}

export interface GeneratedImage {
  buffer: Buffer;
  mimeType: string;
}

export interface ImageGenerationProvider {
  generateImages(params: GenerateImageParams): Promise<GeneratedImage[]>;
}

export interface GenerateVideoParams {
  imageUrl: string;
}

export interface GeneratedVideo {
  buffer: Buffer;
  mimeType: string;
}

export interface VideoGenerationProvider {
  generateVideo(params: GenerateVideoParams): Promise<GeneratedVideo>;
}
