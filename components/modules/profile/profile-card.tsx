import React, { useState, useCallback, useMemo } from "react";
import { useDeleteUser, useGetCurrentUserProfile } from "@/data/user";
import { useGetAllFiles } from "@/data/files";
import { useLogout } from "@/data/auth";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  ShieldCheck,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Verified,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditModal from "./profile-edit-modal";

interface FilesSummary {
  total: number;
  images: number;
  videos: number;
  audios: number;
}

type ProfileSection = "account" | "verification" | "delete";

const ProfileCard: React.FC = React.memo(() => {
  // State management
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useQueryState(
    "section",
    parseAsString.withDefault("account")
  );

  // Data fetching
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserProfile();
  const { data: userFiles, isLoading: isLoadingFiles } = useGetAllFiles();
  const { mutateAsync: deleteUserMutation } = useDeleteUser();
  const { mutateAsync: logoutUser } = useLogout();

  // Memoized user display data
  const userDisplayData = useMemo(() => {
    if (!user) return null;

    return {
      displayName: user.first_name || user.last_name || "User",
      fullName:
        user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : "Not available",
      avatarUrl: user.avatar || null,
      userType: user.role,
      initials: (user.first_name || user.last_name || "U")
        .charAt(0)
        .toUpperCase(),
    };
  }, [user]);

  //   Memoized files summary
  const filesSummary: FilesSummary = useMemo(() => {
    if (!userFiles) return { total: 0, images: 0, videos: 0, audios: 0 };

    return {
      total: userFiles.items.length,
      images: userFiles.items.filter((file) => file.file_type === "image")
        .length,
      videos: userFiles.items.filter((file) => file.file_type === "video")
        .length,
      audios: userFiles.items.filter((file) => file.file_type === "audio")
        .length,
    };
  }, [userFiles]);

  // Handle user account deletion
  const handleDeleteUser = useCallback(async () => {
    if (!user?.id) {
      console.error("User ID not available for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserMutation(user.id);
      setShowModal(false);
      toast.success("Your account has been deleted successfully.");
      handleLogout();
    } catch (error) {
      console.error("Error deleting user:", error);
      // Error handling could be improved with toast notifications
    } finally {
      setIsDeleting(false);
    }
  }, [user?.id, deleteUserMutation]);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // User will be redirected after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  // Handle section navigation
  const handleSectionChange = useCallback(
    (section: ProfileSection) => {
      setCurrentSection(section);
    },
    [setCurrentSection]
  );

  // Loading state
  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">
          Loading profile...
        </span>
      </div>
    );
  }

  // Error state
  if (userError || !user) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error Loading Profile</strong>
          <p className="mt-1">
            Unable to load your profile data. Please refresh the page.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!userDisplayData) return null;

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Navigation Sidebar */}
        <div className="lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              {/* User Profile Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={userDisplayData.avatarUrl || undefined}
                    alt={`${userDisplayData.displayName}'s avatar`}
                  />
                  <AvatarFallback className="text-lg">
                    {userDisplayData.initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold text-lg text-primary dark:text-white">
                    {userDisplayData.displayName}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {userDisplayData.userType}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Navigation Tabs */}
              <Tabs
                value={currentSection}
                onValueChange={(value: string) =>
                  handleSectionChange(value as ProfileSection)
                }
                orientation="vertical"
                className="w-full flex-row pt-6"
              >
                <TabsList className="text-foreground flex-col gap-1 rounded-none bg-transparent px-1 py-0">
                  <TabsTrigger
                    value="account"
                    className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Settings
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Account Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="verification"
                    className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Shield
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Verification & 2FA
                  </TabsTrigger>
                  <TabsTrigger
                    value="delete"
                    className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Trash2
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete Account
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Content */}
        <div className="lg:col-span-8">
          <Tabs
            value={currentSection}
            onValueChange={(value: string) =>
              handleSectionChange(value as ProfileSection)
            }
          >
            {/* Account Settings Section */}
            <TabsContent value="account" className="space-y-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    <p className="text-muted-foreground">
                      Manage your account information and preferences
                    </p>
                  </div>
                  <ProfileEditModal />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <User className="h-4 w-4 text-primary" />
                          <span>Full Name</span>
                        </div>
                        <p className="text-muted-foreground pl-6">
                          {userDisplayData.fullName}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>Email</span>
                        </div>
                        <p className="text-muted-foreground pl-6">
                          {user.email || "Not available"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <User className="h-4 w-4 text-primary" />
                          <span>Gender</span>
                        </div>
                        <p className="text-muted-foreground pl-6">
                          {user.gender || "Not specified"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>Phone Number</span>
                        </div>
                        <p className="text-muted-foreground pl-6">
                          {user.phone || "Not provided"}
                        </p>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Address</span>
                        </div>
                        <p className="text-muted-foreground pl-6">
                          {user.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Files Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Files Summary
                    </h3>
                    {isLoadingFiles ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-muted-foreground">
                          Loading files...
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold text-primary">
                              {filesSummary.total}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Total Files
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-2xl font-bold text-green-600">
                              {filesSummary.images}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Images
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <Video className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold text-blue-600">
                              {filesSummary.videos}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Videos
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <Music className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <div className="text-2xl font-bold text-purple-600">
                              {filesSummary.audios}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Audio
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification & 2FA Section */}
            <TabsContent value="verification" className="space-y-0">
              <Card>
                <CardHeader>
                  <div>
                    <h2 className="text-2xl font-bold">Verification & 2FA</h2>
                    <p className="text-muted-foreground">
                      Manage your account security settings
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Verification */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Email Verification
                    </h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {user?.is_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p
                            className={`text-sm ${
                              user?.is_verified
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {user?.is_verified
                              ? "Email is verified"
                              : "Email is not verified"}
                          </p>
                        </div>
                      </div>
                      <div>
                        {user?.is_verified ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 block"
                            >
                              Not Verified
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log("Verify email clicked");
                                toast.info("Email verification coming soon");
                              }}
                            >
                              Verify Email
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Two-factor Authentication */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Two-factor Authentication (2FA)
                    </h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck
                          className={`h-5 w-5 ${
                            user?.two_factor_enabled
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium">2FA Status</p>
                          <p
                            className={`text-sm ${
                              user?.two_factor_enabled
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {user?.two_factor_enabled
                              ? "Two-factor authentication is enabled"
                              : "Two-factor authentication is disabled"}
                          </p>
                          <p className="text-xs text-muted-foreground italic mt-1">
                            ...coming soon
                          </p>
                        </div>
                      </div>
                      <div>
                        {user?.two_factor_enabled ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 block"
                            >
                              Disabled
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              onClick={() => {
                                console.log("Enable 2FA clicked");
                              }}
                            >
                              Enable 2FA
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Delete Account Section */}
            <TabsContent value="delete" className="space-y-0">
              <Card className="border-destructive">
                <CardHeader>
                  <div>
                    <h2 className="text-2xl font-bold text-destructive">
                      Delete Account
                    </h2>
                    <p className="text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Warning Alert */}
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Warning:</strong> This action cannot be undone.
                      All your data will be permanently deleted.
                    </AlertDescription>
                  </Alert>

                  {/* Account Deletion Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-destructive mb-4">
                      Account Deletion
                    </h3>

                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Before you delete your account, please note that:
                      </p>

                      <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                        <li className="flex items-start space-x-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>
                            All your personal information will be permanently
                            deleted
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>
                            Your files history will be anonymized for our
                            records
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>
                            You will lose access to any uploaded files
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>
                            All saved preferences and settings will be lost
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>
                            This action cannot be reversed under any
                            circumstances
                          </span>
                        </li>
                      </ul>

                      <div className="pt-4 space-y-2">
                        <Button
                          variant="destructive"
                          onClick={() => setShowModal(true)}
                          disabled={isDeleting}
                          className="w-full sm:w-auto"
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Deleting Account...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete My Account
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          You will be asked to confirm this action.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-semibold text-destructive">
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone and will permanently delete all your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Yes, Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
