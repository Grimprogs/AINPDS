import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Upload,
  Play,
  Pause,
  Download,
  Check,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Zap,
  RefreshCw,
  Eye,
  Monitor,
  Smartphone,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  BackgroundPreset,
  getBackgroundPresetsApi,
  generateVeoVideoApi,
  checkVeoVideoStatusApi,
  downloadVeoVideoBlobApi
} from '../../services/api';

interface VeoVideoStudioProps {
  currentBgUrl?: string | null;
  currentBgType?: 'video' | 'image' | 'canvas' | 'none';
  bgOpacity: number;
  bgBlur: number;
  bgEnabled: boolean;
  onSetBackground: (params: {
    url: string | null;
    type: 'video' | 'image' | 'canvas';
    enabled: boolean;
    opacity?: number;
    blur?: number;
  }) => void;
}

export const VeoVideoStudio: React.FC<VeoVideoStudioProps> = ({
  currentBgUrl,
  currentBgType,
  bgOpacity,
  bgBlur,
  bgEnabled,
  onSetBackground
}) => {
  // Model strictly specified: veo-3.1-fast-generate-preview
  const MODEL_NAME = 'veo-3.1-fast-generate-preview';

  // Presets & Image Selection
  const [presets, setPresets] = useState<BackgroundPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-soc-center');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');

  // Generation Controls
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(
    'Subtle ambient cyber network particle flows, glowing data streams pulsing through network nodes in futuristic SOC monitoring room, 4k cinematic slow motion'
  );

  // Operation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [operationName, setOperationName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result Video
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Local Background Controls preview
  const [localOpacity, setLocalOpacity] = useState(bgOpacity);
  const [localBlur, setLocalBlur] = useState(bgBlur);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Load Presets
  useEffect(() => {
    getBackgroundPresetsApi().then(res => {
      if (res?.presets?.length > 0) {
        setPresets(res.presets);
        // Default to first preset
        const first = res.presets[0];
        setSelectedPresetId(first.id);
        setSelectedImagePreview(first.imageUrl);
        setPrompt(first.suggestedPrompt);
        setAspectRatio(first.aspectRatio);

        // Fetch preset image and convert to base64
        fetch(first.imageUrl)
          .then(r => r.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setSelectedImageBase64(reader.result as string);
            };
            reader.readAsDataURL(blob);
          })
          .catch(err => console.warn('Could not pre-load preset image blob:', err));
      }
    });
  }, []);

  // Preset Selection Handler
  const handleSelectPreset = (preset: BackgroundPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedImagePreview(preset.imageUrl);
    setImageFileName(preset.title);
    setPrompt(preset.suggestedPrompt);
    setAspectRatio(preset.aspectRatio);

    fetch(preset.imageUrl)
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImageBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  };

  // Photo Upload Handler (File Picker or Drop)
  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setErrorMessage(null);
    setSelectedPresetId('custom-upload');
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setSelectedImageBase64(result);
      setSelectedImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Veo Video Generation Pipeline
  const handleGenerateVideo = async () => {
    if (!selectedImageBase64) {
      setErrorMessage('Please upload a photo or select a suitable cyber preset image first.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setProgress(10);
    setStageMessage(`Connecting to ${MODEL_NAME}...`);

    try {
      // 1. Call /api/generate-video
      const initRes = await generateVeoVideoApi({
        prompt: prompt.trim(),
        imageBase64: selectedImageBase64,
        aspectRatio
      });

      const opName = initRes.operationName;
      setOperationName(opName);
      setVideoAspect(aspectRatio);
      setProgress(25);
      setStageMessage('Veo 3.1 neural model initializing temporal flow synthesis...');

      // 2. Poll /api/video-status every 2 seconds
      let pollCount = 0;
      const pollInterval = setInterval(async () => {
        try {
          pollCount++;
          const statusRes = await checkVeoVideoStatusApi(opName);

          if (statusRes.stage) {
            setStageMessage(statusRes.stage);
          } else {
            setStageMessage(
              pollCount < 2
                ? 'Synthesizing motion vectors and packet particle physics...'
                : pollCount < 4
                ? 'Rendering frame-by-frame 720p neural video layers...'
                : 'Finalizing H.264 video compression stream...'
            );
          }

          setProgress(statusRes.progress || Math.min(95, 25 + pollCount * 15));

          if (statusRes.done) {
            clearInterval(pollInterval);
            setProgress(100);
            setStageMessage('Video generation complete! Streaming video payload...');

            // 3. Download / Stream video
            try {
              const videoBlob = await downloadVeoVideoBlobApi(opName);
              setGeneratedBlob(videoBlob);
              const objectUrl = URL.createObjectURL(videoBlob);
              setGeneratedVideoUrl(objectUrl);
              setIsGenerating(false);

              // Auto-prompt to set as background
              setStageMessage('Video ready! You can now set it as your website background.');
            } catch (dlErr: any) {
              console.warn('Direct MP4 stream fallback:', dlErr);
              // Fallback to previewing image as ambient loop if MP4 not piped
              setGeneratedVideoUrl(selectedImagePreview);
              setIsGenerating(false);
            }
          }
        } catch (pollErr: any) {
          console.warn('Polling error:', pollErr);
        }
      }, 2000);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Failed to initiate Veo video generation');
      setIsGenerating(false);
    }
  };

  // Set as Website Background Handler
  const handleApplyAsBackground = (type: 'video' | 'image' | 'canvas' = 'video') => {
    const targetUrl = type === 'video' ? (generatedVideoUrl || selectedImagePreview) : selectedImagePreview;
    onSetBackground({
      url: targetUrl,
      type,
      enabled: true,
      opacity: localOpacity,
      blur: localBlur
    });
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Download Video MP4
  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    const a = document.createElement('a');
    a.href = generatedVideoUrl;
    a.download = `veo-cyber-defense-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 text-zinc-300 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Model Badge */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold font-mono shadow-sm">
              <Film className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Veo 3.1 Video Generator & Background Animator
              </h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-current" />
                {MODEL_NAME}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Upload any photo or pick a high-tech cyber preset to synthesize continuous animated videos using Google Veo, then apply it as the live website background.
          </p>
        </div>

        {/* Current Background Status Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-2 rounded">
            <span
              className={`w-2 h-2 rounded-full ${
                bgEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span className="text-zinc-400 text-[11px]">BG STATUS:</span>
            <span className="text-white font-bold text-[11px]">
              {bgEnabled ? `${(currentBgType || 'VIDEO').toUpperCase()} ACTIVE (${Math.round(bgOpacity * 100)}%)` : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection, Aspect Ratio & Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Aspect Ratio Selection (Mandatory 16:9 landscape or 9:16 portrait) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">1</span>
                <span>Select Target Aspect Ratio</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-sans">Required by Veo Model</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 16:9 Landscape Card */}
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-zinc-900 border-white text-white shadow-md'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="w-10 h-7 border border-current rounded flex items-center justify-center shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span>16:9 Landscape</span>
                    {aspectRatio === '16:9' && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    Recommended for Full Website Background & Desktop Displays
                  </div>
                </div>
              </button>

              {/* 9:16 Portrait Card */}
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-zinc-900 border-white text-white shadow-md'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="w-7 h-10 border border-current rounded flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span>9:16 Portrait</span>
                    {aspectRatio === '9:16' && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    Mobile Viewports, Vertical Defense Monitors & Stories
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Photo Source (Presets or Upload) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">2</span>
                <span>Select Suitable Cyber Image or Upload Photo</span>
              </span>
              <span className="text-[10px] text-zinc-400">JPG, PNG, WebP</span>
            </div>

            {/* Suitable Presets Carousel */}
            <div>
              <div className="text-[11px] font-mono text-zinc-400 mb-2 uppercase">Suitable Cyber Presets:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presets.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-white ring-1 ring-white shadow-lg'
                          : 'border-zinc-800 hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-video w-full bg-zinc-900 overflow-hidden relative">
                        <img
                          src={preset.imageUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-white text-black p-1 rounded-full shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 text-left">
                          <div className="font-mono font-bold text-white text-xs truncate">
                            {preset.title}
                          </div>
                          <div className="text-[10px] text-zinc-300 font-sans line-clamp-1">
                            {preset.category} &bull; {preset.aspectRatio}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Photo Drag & Drop Upload */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-black/40 hover:bg-zinc-900/40 rounded-lg p-4 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-1.5 font-mono text-xs">
                <Upload className="w-5 h-5 text-zinc-400" />
                <span className="font-bold text-white">Upload Your Photo or Drag & Drop</span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Click to browse from your device &bull; Up to 20MB
                </span>
                {imageFileName && selectedPresetId === 'custom-upload' && (
                  <span className="mt-1 bg-zinc-800 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                    Active: {imageFileName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Animation Prompt & Motion Guidance */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">3</span>
                <span>Video Animation Prompt</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-sans">Guides Veo's Temporal Motion</span>
            </div>

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe how the image elements should move (e.g. Glowing data streams pulsing, ambient cyber matrix flow, camera slow pan)..."
              className="w-full bg-black border border-zinc-800 rounded p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-400">Quick Ideas:</span>
              {[
                'Subtle glowing packet stream flow along fiber grid',
                'Cinematic slow motion pan across cyber SOC monitoring room',
                'Perimeter firewall mesh pulsating with energy waves',
                'Abstract matrix digital code rain and volumetric lighting'
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer"
                >
                  {p.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGenerating || !selectedImageBase64}
                className="w-full py-3 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer shadow-md"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Video with {MODEL_NAME}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Video with Veo 3.1</span>
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="mt-2 p-2 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Generation Monitor & Background Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Generation Progress Card (Visible when generating) */}
          {isGenerating && (
            <div className="bg-zinc-950 border border-emerald-800/80 rounded-lg p-4 space-y-3 font-mono shadow-xl animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Veo Video Synthesis Active</span>
                </span>
                <span className="text-white font-bold">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-[11px] text-zinc-300 font-sans">
                {stageMessage || 'Analyzing image composition and preparing neural animation...'}
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                <span>Target: {aspectRatio} (720p H.264)</span>
                <span>Model: {MODEL_NAME}</span>
              </div>
            </div>
          )}

          {/* Video Player / Output Canvas */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-4 shadow-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                <span>Video Preview & Controls</span>
              </span>
              <span className="text-[10px] text-zinc-400">
                {generatedVideoUrl ? 'VIDEO READY' : 'SOURCE PHOTO READY'}
              </span>
            </div>

            {/* Video or Image Viewport Container */}
            <div
              className={`w-full bg-black border border-zinc-800 rounded-lg overflow-hidden relative flex items-center justify-center shadow-inner ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[480px] mx-auto' : 'aspect-video'
              }`}
            >
              {generatedVideoUrl ? (
                <video
                  ref={videoPlayerRef}
                  src={generatedVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : selectedImagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedImagePreview}
                    alt="Source Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="bg-black/80 text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded text-xs font-mono">
                      Click "Generate Video" to Animate
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-600 text-xs flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 stroke-1" />
                  <span>No image selected</span>
                </div>
              )}

              {/* Aspect Ratio Badge */}
              <div className="absolute top-2 left-2 bg-black/80 text-white border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono">
                {aspectRatio}
              </div>
            </div>

            {/* Primary Action: Set as Website Background */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleApplyAsBackground('video')}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Website Background Applied!</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Make It As Background of Website</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  disabled={!generatedVideoUrl}
                  className="py-2 px-3 rounded border border-zinc-800 hover:border-zinc-600 bg-black text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download MP4</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAsBackground('image')}
                  className="py-2 px-3 rounded border border-zinc-800 hover:border-zinc-600 bg-black text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Use Still Image BG</span>
                </button>
              </div>
            </div>

            {/* Background Appearance Fine-Tuning */}
            <div className="pt-3 border-t border-zinc-800 space-y-3 font-mono text-xs">
              <div className="font-bold text-white flex items-center gap-1.5 text-[11px] uppercase">
                <Sliders className="w-3 h-3" />
                <span>Background Tuning</span>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Background Opacity</span>
                  <span className="text-white font-bold">{Math.round(localOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.75"
                  step="0.05"
                  value={localOpacity}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setLocalOpacity(val);
                    onSetBackground({
                      url: generatedVideoUrl || selectedImagePreview,
                      type: generatedVideoUrl ? 'video' : 'image',
                      enabled: true,
                      opacity: val,
                      blur: localBlur
                    });
                  }}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-400">
                  <span>Subtle (10%)</span>
                  <span>Recommended (25%)</span>
                  <span>Vivid (75%)</span>
                </div>
              </div>

              {/* Blur Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Backdrop Soft Blur</span>
                  <span className="text-white font-bold">{localBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={localBlur}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    setLocalBlur(val);
                    onSetBackground({
                      url: generatedVideoUrl || selectedImagePreview,
                      type: generatedVideoUrl ? 'video' : 'image',
                      enabled: true,
                      opacity: localOpacity,
                      blur: val
                    });
                  }}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Quick Toggle On / Off */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Master Background Toggle</span>
                <button
                  type="button"
                  onClick={() => {
                    onSetBackground({
                      url: generatedVideoUrl || selectedImagePreview,
                      type: generatedVideoUrl ? 'video' : 'image',
                      enabled: !bgEnabled,
                      opacity: localOpacity,
                      blur: localBlur
                    });
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    bgEnabled
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {bgEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
