import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { ProjectDetailsSection } from "../components/ProjectDetailsSection";
import { AssetGallerySection } from "../components/AssetGallerySection";
import { useCreateAdPipeline } from "../hooks/useCreateAdPipeline";

export function CreateAd() {
  const {
    projectName,
    setProjectName,
    productName,
    setProductName,
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
  } = useCreateAdPipeline();

  return (
    <div className="grain min-h-screen bg-ink">
      <Navbar />
      <main className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <ImageUploadSection
            productPreview={productPreview}
            modelPreview={modelPreview}
            onSelectProduct={handleProductSelect}
            onSelectModel={handleModelSelect}
            onLoadPreset={loadPreset}
          />

          <ProjectDetailsSection
            projectName={projectName}
            setProjectName={setProjectName}
            productName={productName}
            setProductName={setProductName}
            ratios={ratios}
            toggleRatio={toggleRatio}
            generateVideoCut={generateVideoCut}
            setGenerateVideoCut={setGenerateVideoCut}
            direction={direction}
            setDirection={setDirection}
            busy={busy}
            stepText={stepText}
            onSubmit={submit}
          />
        </div>

        <AssetGallerySection
          assets={assets}
          currentProject={currentProject}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ratios={ratios}
          selectedRatio={selectedRatio}
          setSelectedRatio={setSelectedRatio}
          busy={busy}
          onReRoll={submit}
          onToggleFavorite={handleToggleFavorite}
          onDeleteAsset={handleDeleteAsset}
          onGenerateVideo={handleGenerateVideoForAsset}
          onDownload={handleDownload}
          generatingVideoForId={generatingVideoForId}
        />
      </main>
      <Footer />
    </div>
  );
}

export default CreateAd;
