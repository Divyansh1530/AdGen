import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import rawProduct from "../assets/images/raw-product.jpg";
import rawModel from "../assets/images/raw-model.jpg";
import { useAuth } from "./useAuth";
import {
  createProject,
  uploadProjectImages,
  generateProjectImages,
  generateProjectVideo,
  getProjectById,
  getProjectGenerations,
  toggleFavoriteImage,
  deleteGeneratedAsset,
} from "../api/projects";
import type { Project, GeneratedAsset, AspectRatio } from "../types/project";

function toBackendRatio(ratio: string): AspectRatio {
  switch (ratio) {
    case "4:5":
    case "2:3":
      return "PORTRAIT_4_5";
    case "1:1":
      return "SQUARE_1_1";
    case "16:9":
    case "3:2":
      return "LANDSCAPE_16_9";
    case "9:16":
    default:
      return "PORTRAIT_9_16";
  }
}

export function useCreateAdPipeline() {
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get("projectId") || undefined;
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Project details
  const [projectName, setProjectName] = useState("Serum Studio Campaign");
  const [productName, setProductName] = useState("Halcyon Radiance Serum");
  const [productDescription, setProductDescription] = useState(
    "All-day skin radiance serum formulated with organic botanical extract",
  );
  const [direction, setDirection] = useState(
    "warm studio lighting, editorial serum campaign, subtle gloss shadow",
  );

  // Files & previews
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);

  // Output settings
  const [ratios, setRatios] = useState<string[]>(["4:5", "9:16"]);
  const [generateVideoCut, setGenerateVideoCut] = useState(true);
  const [selectedRatio, setSelectedRatio] = useState("4:5");
  const [activeTab, setActiveTab] = useState<"stills" | "video">("stills");

  // Status & active project
  const [busy, setBusy] = useState(false);
  const [stepText, setStepText] = useState("");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [generatingVideoForId, setGeneratingVideoForId] = useState<string | null>(null);

  // Load project if projectId query param is provided
  useEffect(() => {
    if (!queryProjectId) return;

    async function loadExistingProject() {
      try {
        setBusy(true);
        setStepText("Loading campaign details...");
        const res = await getProjectById(queryProjectId as string);
        if (res?.data?.project) {
          const proj = res.data.project;
          setCurrentProject(proj);
          setProjectName(proj.name);
          setProductName(proj.productName);
          if (proj.productDescription) setProductDescription(proj.productDescription);
          if (proj.userPrompt) setDirection(proj.userPrompt);
          if (proj.productImageUrl) setProductPreview(proj.productImageUrl);
          if (proj.modelImageUrl) setModelPreview(proj.modelImageUrl);

          // Load generated assets
          const genRes = await getProjectGenerations(queryProjectId as string);
          if (genRes?.data?.assets) {
            setAssets(genRes.data.assets);
            const hasVideos = genRes.data.assets.some((a) => a.type === "VIDEO");
            if (hasVideos) setActiveTab("stills");
          }
        }
      } catch (err: any) {
        toast.error("Failed to load project: " + (err?.message || "Not found"));
      } finally {
        setBusy(false);
        setStepText("");
      }
    }

    loadExistingProject();
  }, [queryProjectId]);

  const toggleRatio = (r: string) =>
    setRatios((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  // Load sample photos helper
  const loadPreset = async () => {
    try {
      setProductPreview(rawProduct);
      setModelPreview(rawModel);
      setDirection("warm studio lighting, editorial serum campaign, subtle gloss shadow");

      // Convert bundled assets to real File objects
      const [prodRes, modelRes] = await Promise.all([fetch(rawProduct), fetch(rawModel)]);
      const [prodBlob, modelBlob] = await Promise.all([prodRes.blob(), modelRes.blob()]);
      const pFile = new File([prodBlob], "sample-product.jpg", { type: "image/jpeg" });
      const mFile = new File([modelBlob], "sample-model.jpg", { type: "image/jpeg" });

      setProductFile(pFile);
      setModelFile(mFile);
      toast.success("Loaded sample product & model photos");
    } catch {
      toast.error("Could not load sample photos");
    }
  };

  const handleProductSelect = (file: File | null) => {
    setProductFile(file);
    if (file) {
      setProductPreview(URL.createObjectURL(file));
    } else {
      setProductPreview(null);
    }
  };

  const handleModelSelect = (file: File | null) => {
    setModelFile(file);
    if (file) {
      setModelPreview(URL.createObjectURL(file));
    } else {
      setModelPreview(null);
    }
  };

  // Main Generation Pipeline
  const submit = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in or create an account to start generating.");
      navigate("/login");
      return;
    }

    if (!productFile && !productPreview) {
      toast.error("Please upload a product image.");
      return;
    }

    if (!modelFile && !modelPreview) {
      toast.error("Please upload a model image.");
      return;
    }

    if (ratios.length === 0) {
      toast.error("Pick at least one aspect ratio.");
      return;
    }

    // Check credits
    if (user && user.credits < 3) {
      toast.error(`You have ${user.credits} credits. Generating images requires 3 credits.`);
      return;
    }

    try {
      setBusy(true);

      // Step 1: Create project in backend
      setStepText("01/04 Initializing project & workspace...");
      const selectedAspect = toBackendRatio(ratios[0] || "4:5");

      const createRes = await createProject({
        name: projectName.trim() || "AdGen Campaign",
        productName: productName.trim() || "Product",
        productDescription: productDescription.trim() || undefined,
        userPrompt: direction.trim() || undefined,
        aspectRatio: selectedAspect,
      });

      const projectId = createRes.data.project.id;
      setCurrentProject(createRes.data.project);

      // Step 2: Upload images if files exist (or fetch from preview)
      setStepText("02/04 Uploading assets to storage...");
      let pFile = productFile;
      let mFile = modelFile;

      if (!pFile && productPreview) {
        const res = await fetch(productPreview);
        const blob = await res.blob();
        pFile = new File([blob], "product.jpg", { type: "image/jpeg" });
      }
      if (!mFile && modelPreview) {
        const res = await fetch(modelPreview);
        const blob = await res.blob();
        mFile = new File([blob], "model.jpg", { type: "image/jpeg" });
      }

      if (!pFile || !mFile) {
        throw new Error("Missing image files for upload");
      }

      await uploadProjectImages(projectId, pFile, mFile);

      // Step 3: Trigger Mock Image Generation (deducts 3 credits)
      setStepText("03/04 Rendering 3 cinematic ad creatives...");
      const genRes = await generateProjectImages(projectId);
      let currentAssets = genRes.data.assets;
      setAssets(currentAssets);
      setCurrentProject(genRes.data.project);

      // Step 4: If video is checked, generate video from first image (deducts 5 credits)
      if (generateVideoCut && currentAssets.length > 0) {
        setStepText("04/04 Generating 12s motion video cut...");
        const firstImage = currentAssets[0];
        if (firstImage) {
          try {
            const vidRes = await generateProjectVideo(projectId, firstImage.id);
            currentAssets = [...currentAssets, vidRes.data.video];
            setAssets(currentAssets);
          } catch (vidErr: any) {
            console.error("Video generation failed:", vidErr);
            toast.error("Video generation failed: " + (vidErr?.message || "Error"));
          }
        }
      }

      // Refresh credits balance in UI
      await refreshUser();

      setSelectedRatio(ratios[0] || "4:5");
      toast.success("Generation complete! Finished ad assets are ready.");
    } catch (err: any) {
      console.error("Pipeline error:", err);
      toast.error(err?.message || "Failed to generate campaign. Please try again.");
    } finally {
      setBusy(false);
      setStepText("");
    }
  };

  // Toggle favorite on an image
  const handleToggleFavorite = async (assetId: string) => {
    if (!currentProject) return;
    try {
      const res = await toggleFavoriteImage(currentProject.id, assetId);
      const updatedAsset = res.data.asset;
      setAssets((prev) =>
        prev.map((a) =>
          a.id === assetId
            ? { ...a, isSelected: updatedAsset.isSelected }
            : a.type === "IMAGE" && updatedAsset.isSelected
              ? { ...a, isSelected: false }
              : a,
        ),
      );
      toast.success(
        updatedAsset.isSelected ? "Asset marked as hero / favorite!" : "Removed from favorites.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update favorite status");
    }
  };

  // Generate video for a specific still
  const handleGenerateVideoForAsset = async (assetId: string) => {
    if (!currentProject) return;
    if (user && user.credits < 5) {
      toast.error(`Generating a video requires 5 credits. Current balance: ${user.credits}`);
      return;
    }

    try {
      setGeneratingVideoForId(assetId);
      toast.info("Generating motion video from selected image...");
      const res = await generateProjectVideo(currentProject.id, assetId);
      setAssets((prev) => [...prev, res.data.video]);
      await refreshUser();
      setActiveTab("video");
      toast.success("Motion video cut generated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Video generation failed");
    } finally {
      setGeneratingVideoForId(null);
    }
  };

  // Delete an asset
  const handleDeleteAsset = async (assetId: string) => {
    if (!currentProject) return;
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      await deleteGeneratedAsset(currentProject.id, assetId);
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      toast.success("Asset deleted successfully.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete asset");
    }
  };

  const handleDownload = (url: string, name: string) => {
    window.open(url, "_blank");
    toast.success(`Opening high-resolution ${name} asset...`);
  };

  return {
    projectName,
    setProjectName,
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    direction,
    setDirection,
    productPreview,
    modelPreview,
    ratios,
    toggleRatio,
    generateVideoCut,
    setGenerateVideoCut,
    selectedRatio,
    setSelectedRatio,
    activeTab,
    setActiveTab,
    busy,
    stepText,
    currentProject,
    assets,
    generatingVideoForId,
    loadPreset,
    handleProductSelect,
    handleModelSelect,
    submit,
    handleToggleFavorite,
    handleGenerateVideoForAsset,
    handleDeleteAsset,
    handleDownload,
  };
}

export default useCreateAdPipeline;
