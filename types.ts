export enum DownloadStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface VideoData {
  id: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  size: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Twitter' | 'Sora' | 'Unknown';
  downloadUrl?: string; // Optional override for the actual video file to download
}

export interface AICaptionResponse {
  captions: string[];
  hashtags: string[];
  viralScore: number;
}