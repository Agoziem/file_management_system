"use client";
import { Card } from "@/components/ui/card";
import { FileText, ImageIcon, Upload, User, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <Card className="p-4 w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {fetchQuickActions.map((action) => (
          <Link
            key={action.id}
            className="flex flex-col items-center justify-center p-6 rounded-lg shadow-sm transition-colors h-full dark:bg-secondary dark:hover:border-accent dark:hover:text-accent min-w-0 border border-border dark:border-0"
            href={action.href}
          >
            <div
              className={`h-12 w-12 rounded-full mb-3 shrink-0 flex items-center justify-center ${action.iconBg} ${action.iconColor}`}
            >
              {action.icon}
            </div>
            <span className="text-sm font-medium text-center whitespace-nowrap dark:text-secondary-foreground">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
