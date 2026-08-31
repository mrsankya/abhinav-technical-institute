import React, { useState, useRef } from 'react';
import { Award, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle2, ChevronRight, X, ZoomIn, Film, Image as ImageIcon } from 'lucide-react';
import type { Language } from '../types';
import type { AwardsSectionData, AwardMediaItem } from '../services/cms';

interface AwardsSectionProps {
  language: Language;
  awardsData: AwardsSectionData;
  onOpenEnquiry?: () => void;
}

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  language,
  awardsData,
  onOpenEnquiry,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMedia, setActiveMedia] = useState<AwardMediaItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'video'>('all');
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const filteredGallery = awardsData.gallery.filter((item) => {
    if (activeTab === 'photos') return item.type === 'image';
    if (activeTab === 'video') return item.type === 'video';
    return true;
  });

  return (
    <section id="awards-section" className="relative py-16 md:py-24 bg-gradient-to-b from-[#001738] via-[#002760] to-[#001738] text-white overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD21F]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#004bb5]/20 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFD21F_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFD21F]/20 via-[#FFD21F]/30 to-[#FFD21F]/20 border border-[#FFD21F]/50 text-[#FFD21F] text-xs md:text-sm font-bold tracking-wide shadow-lg mb-4 backdrop-blur-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-[#FFD21F]" />
            <span>{isMr ? awardsData.badgeMr : isHi ? 'विशेष राज्यस्तरीय सम्मान' : awardsData.badge}</span>
            <Sparkles className="w-4 h-4 text-[#FFD21F]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-['Outfit',sans-serif]">
            {isMr ? (
              <>
                <span className="text-[#FFD21F]">{awardsData.headingMr}</span>
              </>
            ) : isHi ? (
              <>
                <span className="text-[#FFD21F]">लोकमत लोकरत्न सम्मान २०२६</span>
              </>
            ) : (
              <>
                <span className="text-[#FFD21F]">{awardsData.heading}</span>
              </>
            )}
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-['Manrope',sans-serif]">
            {isMr ? awardsData.subheadingMr : isHi ? 'तकनीकी शिक्षा व कौशल विकास में २५+ वर्षों के योगदान के लिए लोकमत मीडिया समूह व गोदावरी फाउंडेशन द्वारा विशेष गौरव।' : awardsData.subheading}
          </p>
        </div>

        {/* Main Showcase Hero Banner (Award Details + Featured Video) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-16 bg-gradient-to-br from-[#001f4d]/90 to-[#001533]/95 border border-[#FFD21F]/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Subtle Top Gold Banner Ribbon */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#FFD21F] to-transparent"></div>

          {/* Left Column: Award Credentials & Highlight Points */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFD21F] text-[#002760] font-black text-xs uppercase tracking-wider shadow-sm">
                <Award className="w-3.5 h-3.5" />
                {awardsData.year} State Honor
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-slate-200">
                {isMr ? awardsData.presentedByMr : awardsData.presentedBy}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mb-2">
                {isMr ? awardsData.mainAwardTitleMr : awardsData.mainAwardTitle}
              </h3>
              <p className="text-[#FFD21F] text-base sm:text-lg font-bold flex flex-wrap items-center gap-2">
                <span>{isMr ? awardsData.recipientNameMr : awardsData.recipientName}</span>
                <span className="text-slate-400 font-normal text-sm">|</span>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  {isMr ? awardsData.recipientRoleMr : awardsData.recipientRole}
                </span>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed border-l-4 border-[#FFD21F] pl-4 py-1 italic bg-white/[0.02] rounded-r-lg">
              "{isMr ? awardsData.descriptionMr : awardsData.description}"
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {awardsData.highlightPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl hover:border-[#FFD21F]/40 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD21F] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                    {isMr ? pt.mr : pt.en}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onOpenEnquiry && (
                <button
                  onClick={onOpenEnquiry}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD21F] to-[#f3be06] hover:from-[#f0c20f] hover:to-[#dfab00] text-[#002760] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{isMr ? 'प्रवेश व करिअर चौकशी करा' : 'Apply For Admission'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <a
                href="#award-gallery"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#FFD21F]" />
                <span>{isMr ? 'सर्व छायाचित्रे पहा (५)' : 'View Photos (5)'}</span>
              </a>
            </div>
          </div>

          {/* Right Column: High Quality Full-Widescreen (16:9) Video Player */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFD21F]/40 shadow-2xl bg-black group aspect-video w-full">
              <video
                ref={videoRef}
                src={awardsData.featuredVideo.src}
                playsInline
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain bg-black cursor-pointer"
                onClick={togglePlay}
              />

              {/* Play / Pause Center Overlay Button */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/25"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFD21F] text-[#002760] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 mb-2.5">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current text-[#002760]" />
                  </div>
                  <span className="text-white font-black text-xs sm:text-sm bg-black/70 px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                    {isMr ? 'व्हिडिओ पहा (Watch Award Video)' : 'Watch Award Ceremony Video'}
                  </span>
                </div>
              )}

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 flex items-center justify-between text-white z-20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
                  </button>
                </div>

                <div className="text-right px-2">
                  <p className="text-xs font-bold text-[#FFD21F] truncate max-w-[200px] sm:max-w-xs">
                    {isMr ? awardsData.featuredVideo.titleMr : awardsData.featuredVideo.title}
                  </p>
                  <p className="text-[10px] text-slate-300">16:9 Widescreen HD 1080p</p>
                </div>

                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Top Tag */}
              <div className="absolute top-3 left-3 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider shadow">
                  <Film className="w-3.5 h-3.5" />
                  Official Ceremony Video
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Award Ceremony Gallery Section */}
        <div id="award-gallery" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFD21F]" />
                <span>{isMr ? 'सन्मान सोहळा छायाचित्र दालन' : 'Award Ceremony Photo Gallery'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {isMr ? 'लोकमत लोकरत्न सन्मान सोहळ्याचे खास संस्मरणीय क्षण' : 'Key moments from the prestigious felicitation ceremony'}
              </p>
            </div>

            {/* Gallery Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all' ? 'bg-[#FFD21F] text-[#002760] shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isMr ? 'सर्व (५)' : 'All (5)'}
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'photos' ? 'bg-[#FFD21F] text-[#002760] shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isMr ? 'छायाचित्रे' : 'Photos'}
              </button>
            </div>
          </div>

          {/* Grid of Award Photographs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => setActiveMedia(item)}
                className="group relative bg-[#001f4d]/80 rounded-2xl overflow-hidden border border-white/15 hover:border-[#FFD21F]/60 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.src}
                    alt={isMr ? item.titleMr || item.title : item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[#FFD21F] text-[10px] font-black uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}

                  {/* Zoom In Action Indicator */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#FFD21F] text-[#002760] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption / Description */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FFD21F] transition-colors line-clamp-2">
                      {isMr ? item.titleMr || item.title : item.title}
                    </h4>
                    {(item.description || item.descriptionMr) && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {isMr ? item.descriptionMr || item.description : item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FFD21F] font-semibold">
                    <span>{isMr ? 'पूर्ण आकारात पहा' : 'View Full Image'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#001738] rounded-2xl overflow-hidden border border-[#FFD21F]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title & Close */}
            <div className="p-4 bg-[#002760] border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFD21F]" />
                <span className="font-bold text-sm sm:text-base">
                  {isMr ? activeMedia.titleMr || activeMedia.title : activeMedia.title}
                </span>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            <div className="relative max-h-[75vh] flex items-center justify-center bg-black p-2 sm:p-4">
              <img
                src={activeMedia.src}
                alt={isMr ? activeMedia.titleMr || activeMedia.title : activeMedia.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer with Description */}
            <div className="p-4 bg-[#001f4d] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-300">
              <p>{isMr ? activeMedia.descriptionMr || activeMedia.description : activeMedia.description}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[#FFD21F] font-bold">Lokmat Lokratna 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
