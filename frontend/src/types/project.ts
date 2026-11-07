export type AspectRatio = "PORTRAIT_9_16" | "PORTRAIT_4_5" | "SQUARE_1_1" | "LANDSCAPE_16_9";

export type ProjectStatus =
  "DRAFT" | "GENERATING_IMAGE" | "IMAGE_GENERATED" | "GENERATING_VIDEO" | "COMPLETED" | "FAILED";

export type AssetType = "IMAGE" | "VIDEO";

export interface GeneratedAsset {
  id: string;
  projectId: string;
  type: AssetType;
  url: string;
  sourceAssetId?: string | null;
  status: "PROCESSING" | "READY" | "FAILED";
  isSelected: boolean;
  createdAt: string;
  derivedVideos?: { id: string }[];
  sourceAsset?: { id: string; type: AssetType; url: string } | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  productName: string;
  productDescription?: string | null;
  userPrompt?: string | null;
  aspectRatio: AspectRatio;
  productImageUrl?: string | null;
  modelImageUrl?: string | null;
  status: ProjectStatus;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  generatedAssets?: GeneratedAsset[];
}

export interface CreateProjectInput {
  name: string;
  productName: string;
  productDescription?: string | undefined;
  userPrompt?: string | undefined;
  aspectRatio?: AspectRatio | undefined;
}

export interface UpdateProjectInput {
  name?: string | undefined;
  productName?: string | undefined;
  productDescription?: string | null | undefined;
  userPrompt?: string | null | undefined;
  aspectRatio?: AspectRatio | undefined;
}
