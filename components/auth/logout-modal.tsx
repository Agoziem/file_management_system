import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/custom/spinner";
import { useLogout } from "@/data/auth";

type LogoutModalProps = {
  open: boolean;
  handleToggle: (open: boolean) => void;
};

const LogoutModal = ({ open, handleToggle }: LogoutModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();

  const Logout = async () => {
    setSubmitting(true);
    try {
      const response = await logout();
      toast.success(response?.message || "Logout successful!");
      removeToken();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || "Login failed.");
    }
    setSubmitting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to logout?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={Logout}>
            {submitting ? <ButtonSpinner label="signing out..." /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
