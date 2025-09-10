import { FileResponse } from "@/types/files";
import {
  FileText,
  ImageIcon,
  Video,
  Headphones,
  Archive,
  Clock,
  BarChart3,
  User,
} from "lucide-react";

export const fileTypeColors = {
  Documents: "bg-blue-500",
  Image: "bg-purple-500",
  Video: "bg-purple-300",
  Audio: "bg-yellow-500",
  ZIP: "bg-red-500"
};

export const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", active: true, href: "/" },
  { icon: Clock, label: "Recent files", href: "/recent" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: ImageIcon, label: "Image", href: "/images" },
  { icon: Video, label: "Videos", href: "/videos" },
  { icon: Headphones, label: "Audios", href: "/audios" },
  { icon: User, label: "Manage Profile", href: "/profile" }
];

export const recentFiles = [
  { name: "Campaign Analysis - Q3.docx", size: "2.7 MB", type: "Document", icon: FileText },
  { name: "HR_meeting_notes_2024.docx", size: "8.4 MB", type: "Image", icon: FileText },
  { name: "landscape_002.jpg", size: "4.2 MB", type: "Image", icon: ImageIcon }
];

// Test with sample data
export const sampleData: FileResponse[] = [
    {
      id: "1",
      user_id: "123",
      file_url: "https://example.com/test.pdf",
      file_name: "test.pdf",
      file_type: "document",
      file_size: 1024,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      user_id: "123",
      file_url: "https://example.com/test.jpg",
      file_name: "test.jpg",
      file_type: "image",
      file_size: 1024,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];
  

export const storageData = [
  { type: "Documents", files: 42, size: "112.8 MB", icon: FileText },
  { type: "Image", files: 75, size: "286.8 MB", icon: ImageIcon },
  { type: "Video", files: 32, size: "639.2 MB", icon: Video },
  { type: "Audio", files: 20, size: "23.6 MB", icon: Headphones },
  { type: "ZIP", files: 14, size: "213.3 MB", icon: Archive }
];