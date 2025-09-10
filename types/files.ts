// File and Storage Response Models
export interface FileResponse {
  id: string;
  user_id: string;
  file_name: string;
  file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
  file_size: number;
  file_url: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface FileList {
  items: FileResponse[];
  count: number;
}

export interface StorageResponse {
  id: string;
  user_id: string;
  total_space: number;
  used_space: number;
  created_at: string; // ISO datetime string
}

// Upload/Delete Response Models
export interface FileUploadResponse {
  url: string;
  file_id: string;
  status: string;
}

export interface FileDeleteResponse {
  status: string;
}

export interface MultipleFileUploadResponse {
  urls: string[];
  file_ids: string[];
  status: string;
}

// Analytics Models
export interface FileTypeDistribution {
  type_distribution: {
    [key: string]: number;
  };
}

export interface StorageUsageTrend {
  storage_trends: {
    dates: string[];
    file_counts: number[];
    sizes: number[];
  };
}

export interface FileActivity {
  id: string;
  file_name: string;
  file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
  file_size: number;
  updated_at: string; // ISO datetime string
  created_at: string; // ISO datetime string
  action: string;
}

export interface RecentActivityResponse {
  recent_activity: Array<{
    id: string;
    file_name: string;
    file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
    file_size: number;
    updated_at: string;
    created_at: string;
    action: string;
  }>;
}

export interface LargeFile {
  id: string;
  file_name: string;
  file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
  file_size: number;
  size_mb: number;
  created_at: string; // ISO datetime string
}

export interface LargeFilesResponse {
  large_files: Array<{
    id: string;
    file_name: string;
    file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
    file_size: number;
    size_mb: number;
    created_at: string;
  }>;
}

export interface FileAnalyticsDashboard {
  type_distribution: {
    [key: string]: number;
  };
  storage_trends: {
    dates: string[];
    file_counts: number[];
    sizes: number[];
  };
  recent_activity: Array<{
    id: string;
    file_name: string;
    file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
    file_size: number;
    updated_at: string;
    created_at: string;
    action: string;
  }>;
  large_files: Array<{
    id: string;
    file_name: string;
    file_type: 'image' | 'document' | 'video' | 'audio' | 'other';
    file_size: number;
    size_mb: number;
    created_at: string;
  }>;
}

// Utility type for file type enumeration
export type FileTypeEnum = 'image' | 'document' | 'video' | 'audio' | 'other';

// Mini models for specific use cases
export interface FilePreview {
  id: string;
  file_name: string;
  file_type: FileTypeEnum;
  file_url: string;
  file_size: number;
}

export interface StorageStats {
  total_space: number;
  used_space: number;
  available_space: number;
  usage_percentage: number;
}