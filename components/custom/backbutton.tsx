import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Backbutton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <Button variant="link" className={`gap-1 ${className}`} onClick={() => router.back()}>
      <ChevronLeftIcon className="opacity-60" size={16} aria-hidden="true" />
      Go back
    </Button>
  );
}
