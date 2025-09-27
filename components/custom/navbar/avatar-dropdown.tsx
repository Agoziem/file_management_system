import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  ShieldCheck,
  UserPenIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCurrentUserProfile } from "@/data/user";
import { useState } from "react";
import LogoutModal from "@/components/modules/auth/logout-modal";
import { CustomDialog } from "../custom-dialog";
import { useDisable2FA, useEnable2FA } from "@/data/auth";
import { ButtonSpinner } from "../spinner";
import Link from "next/link";

export default function AvatarDropdownComponent({
  direction = "end",
}: {
  direction?: "start" | "center" | "end";
}) {
  const { data: userProfile } = useGetCurrentUserProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutateAsync: enable2FA, isLoading: submitting } = useEnable2FA();
  const { mutateAsync: disable2FA, isLoading: disabling } = useDisable2FA();
  const [open2FAModal, setOpen2FAModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar>
              <AvatarImage
                src={userProfile?.avatar || undefined}
                alt={`${userProfile?.first_name} ${userProfile?.last_name}`}
              />
              <AvatarFallback>
                {userProfile?.first_name
                  ? userProfile.first_name.charAt(0).toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <ChevronDownIcon
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-72" align={direction}>
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {userProfile?.first_name} {userProfile?.last_name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {userProfile?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <BoltIcon
                  size={16}
                  className="opacity-60 hover:text-primary"
                  aria-hidden="true"
                />
                <span>Manage Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <Layers2Icon
                  size={16}
                  className="opacity-60 hover:text-primary"
                  aria-hidden="true"
                />
                <span>Storage Options</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen2FAModal(true)}>
              <ShieldCheck
                size={16}
                className="opacity-60 hover:text-primary"
                aria-hidden="true"
              />
              <span>
                {userProfile?.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* logout modal */}
      <LogoutModal
        open={showLogoutModal}
        handleToggle={() => setShowLogoutModal(false)}
      />

      {/* 2FA Modal */}
      <CustomDialog
        title="Two-Factor Authentication"
        showFooter={false}
        open={open2FAModal}
        onOpenChange={setOpen2FAModal}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-4 bg-muted p-3 px-4 rounded-md">
            Two-factor authentication adds an extra layer of security to your
            account. When enabled, you will need to provide a verification code
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                if (userProfile?.two_factor_enabled) {
                  disable2FA();
                } else {
                  enable2FA();
                }
                setOpen2FAModal(false);
              }}
              disabled={submitting}
            >
              {submitting ? (
                <ButtonSpinner label="submitting..." />
              ) : userProfile?.two_factor_enabled ? (
                "Disable 2FA"
              ) : (
                "Enable 2FA"
              )}
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setOpen2FAModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CustomDialog>
    </>
  );
}
