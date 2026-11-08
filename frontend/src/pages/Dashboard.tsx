import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { ProjectGrid } from "../components/ProjectGrid";
import { useAuth } from "../hooks/useAuth";
import { getProjects, deleteProject, updateProject } from "../api/projects";
import type { Project } from "../types/project";

export function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      if (res?.data?.projects) {
        setProjects(res.data.projects);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to view your campaigns.");
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleDelete = async (projectId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" and all its assets?`)) return;

    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Campaign deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete campaign");
    }
  };

  const handleRename = async (projectId: string, newName: string) => {
    try {
      const res = await updateProject(projectId, { name: newName });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, name: res.data.updatedProject.name } : p)),
      );
      toast.success("Campaign renamed successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update campaign");
      throw err;
    }
  };

  return (
    <div className="grain min-h-screen bg-ink">
      <Navbar />
      <main className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:py-20">
        <ProjectGrid
          projects={projects}
          loading={loading}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
