"use client";
import { Card } from "@/components/ui/card";
import { FileText, ImageIcon, Upload, User, VideoIcon } from "lucide-react";
import Link from "next/link";

const fetchQuickActions = [
  {
    id: 1,
    title: "Upload Images",
    icon: <ImageIcon className="h-6 w-6" />,
    href: "/images/upload",
    iconBg: "bg-secondary",
    iconColor: "text-primary",
  },
  {
    id: 2,
    title: "Manage Users",
    icon: <User className="h-6 w-6" />,
    href: "/admin/user-management",
    iconBg: "bg-secondary text-primary",
    iconColor: "text-primary",
  },
  {
    id: 3,
    title: "Upload Documents",
    icon: <FileText className="h-6 w-6" />,
    href: "/documents/upload",
    iconBg: "bg-secondary text-primary",
    iconColor: "text-primary",
  },
  {
    id: 4,
    title: "Upload Videos",
    icon: <VideoIcon className="h-6 w-6" />,
    href: "/videos/upload",
    iconBg: "bg-secondary text-primary",
    iconColor: "text-primary",
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {fetchQuickActions.map((action) => (
        <Card key={action.id} className="p-0">
          <Link
            className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg shadow-sm transition-colors h-full min-w-0 border border-border dark:border-0"
            href={action.href}
          >
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full mb-2 sm:mb-3 shrink-0 flex items-center justify-center ${action.iconBg} ${action.iconColor}`}
            >
              <div className="scale-75 sm:scale-100">{action.icon}</div>
            </div>
            <span className="text-xs sm:text-sm font-medium text-center whitespace-nowrap dark:text-white">
              {action.title}
            </span>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
