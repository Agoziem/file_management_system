import {
  FileText,
  Headphones,
  ImageIcon,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function UploadDropdown({
  component,
 }: { component: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {component}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/documents/upload">
            <FileText size={16} className="opacity-60" aria-hidden="true" />
            New File
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/images/upload">
            <ImageIcon size={16} className="opacity-60" aria-hidden="true" />
            New Images
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/videos/upload">
            <Video size={16} className="opacity-60" aria-hidden="true" />
            New Video
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/audios/upload">
            <Headphones size={16} className="opacity-60" aria-hidden="true" />
            New Audio
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
