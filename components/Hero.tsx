import React, { useState } from 'react';
import { ArrowRight, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { DownloadStatus } from '../types';

interface HeroProps {
  onProcessUrl: (url: string) => void;
  status: DownloadStatus;
}

const platforms = [
  { name: 'TikTok', id: 'tiktok', color: 'hover:text-pink-400' },
  { name: 'Instagram', id: 'instagram', color: 'hover:text-purple-400' },
  { name: 'YouTube', id: 'youtube', color: 'hover:text-red-400' },
  { name: 'X / Twitter', id: 'twitter', color: 'hover:text-blue-400' },
  { name: 'Sora', id: 'sora', color: 'hover:text-white' },
];

const Hero: React.FC<HeroProps> = ({ onProcessUrl, status }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputUrl.trim()) {
      setError('Please paste a valid video URL');
      return;
    }

    if (!inputUrl.startsWith('http')) {
      setError('URL must start with http:// or https://');
      return;
    }

    onProcessUrl(inputUrl);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handlePlatformClick = (platformName: string) => {
    if (selectedPlatform === platformName) {
      setSelectedPlatform(null); // Toggle off if clicked again
    } else {
      setSelectedPlatform(platformName);
    }
  };

  return (
    <div className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-blue-400 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>v2.0 Now with AI Caption Generator</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Download Videos <br/> Without Watermark
        </h1>
        
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          Save high-quality videos from TikTok, Instagram, YouTube, Sora, and more. 
          Just paste the link, and let our AI optimize your repost.
        </p>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl p-2 border border-slate-700 shadow-2xl">
              <div className="pl-4 text-slate-500">
                <LinkIcon size={20} />
              </div>
              <input 
                type="text" 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder={selectedPlatform ? `Paste ${selectedPlatform} link here...` : "Paste video URL here..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3"
              />
              <div className="flex space-x-2">
                <button 
                  type="button"
                  onClick={handlePaste}
                  className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Paste
                </button>
                <button 
                  type="submit"
                  disabled={status === DownloadStatus.PROCESSING}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {status === DownloadStatus.PROCESSING ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <span>Download</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          {error && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-red-400 animate-fade-in">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Supported Platforms Interactive Buttons */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4">
          <span className="text-slate-500 text-sm font-semibold mb-2 md:mb-0">Supported on</span>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform) => {
              const isSelected = selectedPlatform === platform.name;
              return (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformClick(platform.name)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border
                    ${isSelected 
                      ? 'bg-slate-800 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' 
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  {platform.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;