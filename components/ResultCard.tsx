import React, { useState } from 'react';
import { Download, Share2, Sparkles, Copy, Check, Hash, MessageSquare, Loader2 } from 'lucide-react';
import { VideoData, AICaptionResponse } from '../types';
import { generateViralContent } from '../services/gemini';

interface ResultCardProps {
  video: VideoData;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ video, onReset }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiData, setAiData] = useState<AICaptionResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [shareButtonText, setShareButtonText] = useState('Share Link');

  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    try {
      const data = await generateViralContent(video.title, video.platform);
      setAiData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Priority 1: Use specific downloadUrl if provided (e.g. for the demo link)
      // Priority 2: Use Tears of Steel for Sora (looks like high-end AI video)
      // Priority 3: Use Joyrides for everything else
      
      let sampleVideoUrl = video.downloadUrl;
      
      if (!sampleVideoUrl) {
         if (video.platform === 'Sora') {
           // Tears of Steel matches the "AI Video" aesthetic better than cartoons
           sampleVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
         } else {
           sampleVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
         }
      }

      const response = await fetch(sampleVideoUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Sanitize filename from title
      const safeTitle = video.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
      a.download = `SaveSora_${safeTitle}_${Math.floor(Date.now() / 1000)}.mp4`;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      console.error("Download simulation failed:", error);
      // Fallback
      const fallbackUrl = video.downloadUrl || (video.platform === 'Sora' 
        ? "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        : "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4");
      window.open(fallbackUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: video.url,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(video.url);
      setShareButtonText('Copied!');
      setTimeout(() => setShareButtonText('Share Link'), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Thumbnail & Video Info */}
          <div className="md:w-2/5 relative group">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={handleDownload}
                 className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-colors"
               >
                 <Download className="text-white" size={32} />
               </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <span className={`inline-block px-2 py-1 text-xs font-bold rounded mb-2 text-white ${video.platform === 'Sora' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                {video.platform}
              </span>
              <p className="text-white font-medium truncate">{video.title}</p>
              <p className="text-slate-300 text-sm">{video.duration} • {video.size}</p>
            </div>
          </div>

          {/* Actions & AI Section */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Save</h3>
                <p className="text-slate-400 text-sm">Download processed successfully. No watermarks detected.</p>
              </div>
              <button onClick={onReset} className="text-slate-500 hover:text-white text-sm underline">
                Convert another
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download HD</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl font-medium transition-colors border border-slate-700"
              >
                {shareButtonText === 'Copied!' ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                <span className={shareButtonText === 'Copied!' ? "text-green-400" : ""}>{shareButtonText}</span>
              </button>
            </div>

            {/* AI Integration Card */}
            <div className="mt-auto bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles size={100} />
              </div>

              {!aiData ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mb-4 shadow-lg">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Boost Your Reach</h4>
                  <p className="text-slate-400 text-sm mb-4">Generate viral captions & hashtags with Gemini AI before you repost.</p>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isAiLoading}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 border border-slate-600"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing Video...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-purple-400" />
                        <span>Generate AI Content</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2 text-purple-400">
                        <Sparkles size={16} />
                        <span className="text-sm font-semibold uppercase tracking-wider">AI Suggestions</span>
                     </div>
                     <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                       Viral Score: {aiData.viralScore}/100
                     </span>
                   </div>
                   
                   <div className="space-y-3">
                     <div className="space-y-2">
                       <p className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
                         <MessageSquare size={12} /> Captions
                       </p>
                       {aiData.captions.map((cap, idx) => (
                         <div key={idx} className="flex items-start gap-2 group cursor-pointer" onClick={() => copyToClipboard(cap, idx)}>
                           <div className="bg-slate-900/50 p-2 rounded-lg flex-1 text-sm text-slate-200 border border-slate-700 hover:border-blue-500/50 transition-colors">
                             {cap}
                           </div>
                           <button className="p-2 text-slate-500 hover:text-white">
                             {copiedIndex === idx ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                           </button>
                         </div>
                       ))}
                     </div>

                     <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">
                          <Hash size={12} /> Hashtags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {aiData.hashtags.map((tag, i) => (
                            <span key={i} className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded hover:bg-blue-900/50 cursor-default transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;