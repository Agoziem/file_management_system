import {
  FileText,
  ImageIcon,
  Video,
  Headphones,
  Archive,
  Clock,
  BarChart3,
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
  { icon: Clock, label: "Recent files", href: "/recent-files" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: ImageIcon, label: "Image", href: "/images" },
  { icon: Video, label: "Videos", href: "/videos" },
  { icon: Headphones, label: "Audios", href: "/audios" },
  { icon: Archive, label: "Deleted files", href: "/deleted-files" }
];

export const recentFiles = [
  { name: "Campaign Analysis - Q3.docx", size: "2.7 MB", type: "Document", icon: FileText },
  { name: "HR_meeting_notes_2024.docx", size: "8.4 MB", type: "Image", icon: FileText },
  { name: "landscape_002.jpg", size: "4.2 MB", type: "Image", icon: ImageIcon }
];

export const allFiles = [
  {
    id: "1",
    name: "Campaign Analysis - Q3.docx",
    owner: "Brooklyn Simmons",
    size: "2.7 MB",
    date: "Apr 14, 2024",
    icon: FileText
  },
  {
    id: "2",
    name: "rebrand_mockup_v2_20241025.jpg",
    owner: "Cameron Williamson",
    size: "6.7 MB",
    date: "Apr 14, 2024",
    icon: ImageIcon
  },
  {
    id: "3",
    name: "proposal_new_product_jdoe.docx",
    owner: "Brooklyn Simmons",
    size: "1.5 MB",
    date: "Apr 13, 2024",
    icon: FileText
  },
  {
    id: "4",
    name: "landscape_002.jpg",
    owner: "Esther Howard",
    size: "8.4 MB",
    date: "Apr 13, 2024",
    icon: ImageIcon
  },
  {
    id: "5",
    name: "sunset_beach_20241025.jpg",
    owner: "Cameron Williamson",
    size: "7.3 MB",
    date: "Apr 11, 2024",
    icon: ImageIcon
  },
  {
    id: "6",
    name: "social_media_report_20241025.docx",
    owner: "Leslie Alexander",
    size: "2.3 MB",
    date: "Apr 10, 2024",
    icon: FileText
  },
  {
    id: "7",
    name: "HR_meeting_notes_20241025.docx",
    owner: "Jenny Wilson",
    size: "3.1 MB",
    date: "Apr 10, 2024",
    icon: FileText
  },
  {
    id: "8",
    name: "interview_downtown_20241025.mp4",
    owner: "Brooklyn Simmons",
    size: "15.2 MB",
    date: "Apr 10, 2024",
    icon: Video
  },
  {
    id: "9",
    name: "project_files_backup_2024-11-05.zip",
    owner: "Cameron Williamson",
    size: "21.6 MB",
    date: "Apr 09, 2024",
    icon: Archive
  },
  {
    id: "10",
    name: "landscape_003.jpg",
    owner: "Esther Howard",
    size: "3.6 MB",
    date: "Apr 09, 2024",
    icon: ImageIcon
  }
];

export type AllFile = (typeof allFiles)[number];

export const storageData = [
  { type: "Documents", files: 42, size: "112.8 MB", icon: FileText },
  { type: "Image", files: 75, size: "286.8 MB", icon: ImageIcon },
  { type: "Video", files: 32, size: "639.2 MB", icon: Video },
  { type: "Audio", files: 20, size: "23.6 MB", icon: Headphones },
  { type: "ZIP", files: 14, size: "213.3 MB", icon: Archive }
];