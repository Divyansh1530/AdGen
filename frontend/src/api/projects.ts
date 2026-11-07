import api from "./axios";
import type {
  Project,
  GeneratedAsset,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";

export async function getProjects(): Promise<{
  success: boolean;
  message: string;
  data: { projects: Project[] };
}> {
  const res = await api.get<{
    success: boolean;
    message: string;
    data: { projects: Project[] };
  }>("/api/v1/projects");
  return res.data;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<{ success: boolean; message: string; data: { project: Project } }> {
  const res = await api.post<{ success: boolean; message: string; data: { project: Project } }>(
    "/api/v1/projects",
    input,
  );
  return res.data;
}

export async function getProjectById(
  projectId: string,
): Promise<{ success: boolean; message: string; data: { project: Project } }> {
  const res = await api.get<{ success: boolean; message: string; data: { project: Project } }>(
    `/api/v1/projects/${projectId}`,
  );
  return res.data;
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectInput,
): Promise<{ success: boolean; message: string; data: { updatedProject: Project } }> {
  const res = await api.patch<{
    success: boolean;
    message: string;
    data: { updatedProject: Project };
  }>(`/api/v1/projects/${projectId}`, data);
  return res.data;
}

export async function deleteProject(
  projectId: string,
): Promise<{ success: boolean; message: string }> {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/api/v1/projects/${projectId}`,
  );
  return res.data;
}

export async function uploadProjectImages(
  projectId: string,
  productImage: File | Blob,
  modelImage: File | Blob,
): Promise<{ success: boolean; message: string; data: { project: Project } }> {
  const formData = new FormData();
  formData.append("productImage", productImage, "product.jpg");
  formData.append("modelImage", modelImage, "model.jpg");

  const res = await api.post<{ success: boolean; message: string; data: { project: Project } }>(
    `/api/v1/projects/${projectId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function generateProjectImages(projectId: string): Promise<{
  success: boolean;
  message: string;
  data: { project: Project; assets: GeneratedAsset[] };
}> {
  const res = await api.post<{
    success: boolean;
    message: string;
    data: { project: Project; assets: GeneratedAsset[] };
  }>(`/api/v1/projects/${projectId}/generate`);
  return res.data;
}

export async function getProjectGenerations(
  projectId: string,
): Promise<{ success: boolean; message: string; data: { assets: GeneratedAsset[] } }> {
  const res = await api.get<{
    success: boolean;
    message: string;
    data: { assets: GeneratedAsset[] };
  }>(`/api/v1/projects/${projectId}/generations`);
  return res.data;
}

export async function toggleFavoriteImage(
  projectId: string,
  assetId: string,
): Promise<{ success: boolean; message: string; data: { asset: GeneratedAsset } }> {
  const res = await api.patch<{
    success: boolean;
    message: string;
    data: { asset: GeneratedAsset };
  }>(`/api/v1/projects/${projectId}/assets/${assetId}/select`);
  return res.data;
}

export async function generateProjectVideo(
  projectId: string,
  assetId: string,
): Promise<{ success: boolean; message: string; data: { video: GeneratedAsset } }> {
  const res = await api.post<{
    success: boolean;
    message: string;
    data: { video: GeneratedAsset };
  }>(`/api/v1/projects/${projectId}/assets/${assetId}/video`);
  return res.data;
}

export async function deleteGeneratedAsset(
  projectId: string,
  assetId: string,
): Promise<{ success: boolean; message: string }> {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/api/v1/projects/${projectId}/assets/${assetId}`,
  );
  return res.data;
}
