import {
  NotificationCreate,
  NotificationResponse,
} from "@/types/notifications";
import {
  NotificationCreateFormData,
  notificationCreateSchema,
} from "@/schemas/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/custom/imageuploader";
import { UserModel } from "@/types/user";
import {
  useCreateNotification,
  useUpdateNotification,
} from "@/data/notifications";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/custom/spinner";
import { useGetAllUsers, useGetCurrentUserProfile } from "@/data/user";
import { useUploadFile } from "@/data/files";

const NotificationForm = ({
  notification,
  onClose,
}: {
  notification: NotificationResponse | null;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { data: userProfile, isLoading: loadingProfile } =
    useGetCurrentUserProfile();
  const { data: users, isLoading } = useGetAllUsers();
  const { mutateAsync: createNotification } = useCreateNotification();
  const { mutateAsync: updateNotification } = useUpdateNotification();
  const { mutateAsync: uploadFile } = useUploadFile();

  const form = useForm<NotificationCreateFormData>({
    resolver: zodResolver(notificationCreateSchema),
    defaultValues: {
      sender_id: notification?.sender_id || null,
      title: notification?.title || "",
      message: notification?.message || "",
      link: notification?.link || "",
      image: notification?.image || "",
      user_ids: notification?.recipients
        ? (notification.recipients
            .map((recipient) => recipient.id)
            .filter(Boolean) as string[])
        : [], // Empty array for new notifications
    },
  });

  const onSubmit = async (data: NotificationCreateFormData) => {
    if (!userProfile) {
      toast.error("User profile not loaded");
      return;
    }
    try {
      const datatosubmit = {
        ...data,
        sender_id: userProfile.id,
      } as NotificationCreate;

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("file", data.image);
        formData.append("key", data.image.name);
        formData.append("replace", "true");
        const uploadedimage = await uploadFile(formData);
        if (uploadedimage) {
          datatosubmit.image = uploadedimage.url; // Assuming the response contains the URL
          console.log("Image uploaded successfully:", uploadedimage.url);
        } else {
          toast.error("Error uploading image. Please try again.");
          return;
        }
      }
      if (notification) {
        await updateNotification({
          ...datatosubmit,
          id: notification.id, // Ensure to pass the ID for update
        });

        toast.success("Notification updated successfully!");
      } else {
        await createNotification(datatosubmit);
        toast.success("Notification sent successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting notification:", error);
      toast.error("Failed to send notification. Please try again.");
    }
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    const currentUsers = form.getValues("user_ids");
    if (currentUsers.includes(userId)) {
      const updatedUsers = currentUsers.filter((id) => id !== userId);
      form.setValue("user_ids", updatedUsers);
      setSelectedUsers(updatedUsers);
    } else {
      const updatedUsers = [...currentUsers, userId];
      form.setValue("user_ids", updatedUsers);
      setSelectedUsers(updatedUsers);
    }
  };

  // Handle select all users
  const handleSelectAll = () => {
    const currentUsers = form.getValues("user_ids");
    const allUserIds =
      (users?.map((user) => user.id).filter(Boolean) as string[]) || [];

    if (currentUsers.length === (users?.length || 0)) {
      // If all users are selected, deselect all
      form.setValue("user_ids", []);
      setSelectedUsers([]);
    } else {
      // Select all users
      form.setValue("user_ids", allUserIds);
      setSelectedUsers(allUserIds);
    }
  };

  // Check if all users are selected
  const isAllSelected = () => {
    const currentUsers = form.getValues("user_ids");
    return (
      currentUsers.length === (users?.length || 0) && users && users.length > 0
    );
  };

  // Remove a user from the selection
  const removeUser = (userId: string) => {
    const updatedUsers = form
      .getValues("user_ids")
      .filter((id) => id !== userId);
    form.setValue("user_ids", updatedUsers);
    setSelectedUsers(updatedUsers);
  };

  // Get selected user names for display
  const getSelectedUserNames = () => {
    const userIds = form.getValues("user_ids");
    return users?.filter((user) => userIds.includes(user.id)) || [];
  };

  return (
    <div className="space-y-6 px-2">
      <div>
        <p className="text-sm text-muted-foreground">
          {notification
            ? "Update the notification details"
            : "Fill in the details to send a new notification"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter notification title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter notification message"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Link */}
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Image URL (Optional)</FormLabel>
                <FormControl>
                  <ImageUploader
                    name={field.name}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Selection */}
          <FormField
            control={form.control}
            name="user_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipients</FormLabel>
                <div className="space-y-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {field.value?.length > 0
                          ? `${field.value.length} user(s) selected`
                          : "Select users..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      {isLoading ? (
                        <div className="p-4 text-sm text-muted-foreground">
                          Loading users...
                        </div>
                      ) : (
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {/* Select All Option */}
                              <CommandItem
                                onSelect={handleSelectAll}
                                className="font-medium border-gray-200"
                              >
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    isAllSelected()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {isAllSelected()
                                      ? "Deselect All"
                                      : "Select All"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({users?.length || 0} users)
                                  </span>
                                </div>
                              </CommandItem>

                              {/* Individual Users */}
                              {users?.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => handleUserSelect(user.id)}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      field.value?.includes(user.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                      {user.email}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      )}
                    </PopoverContent>
                  </Popover>

                  {/* Selected Users Display */}
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedUserNames().map((user) => (
                        <Badge
                          key={user.id}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <span>
                            {user.first_name} {user.last_name}
                          </span>
                          <button
                            type="button"
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeUser(user.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <ButtonSpinner label="Sending..." className="text-white" />
              ) : notification ? (
                "Update Notification"
              ) : (
                "Send Notification"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotificationForm;
