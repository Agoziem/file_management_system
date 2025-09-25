"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetCurrentUserProfile, useUpdateUser } from "@/data/user";
import { useForm, Controller } from "react-hook-form";
import { UserUpdateSchema } from "@/schemas/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateType } from "@/schemas/users";
import { ButtonSpinner } from "@/components/custom/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationSelector from "@/components/custom/location-select";
import { PhoneInput } from "@/components/custom/phone-input";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageUploader from "@/components/custom/imageuploader";
import { useUploadFile } from "@/data/files";
import { toast } from "sonner";

export default function ProfileEditModal() {
  const { data: userProfile } = useGetCurrentUserProfile();
  const { mutateAsync: updateProfile } = useUpdateUser();
  const [updating, setUpdating] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [open, setOpen] = useState(false);

  // Use the imported Zod schema and type
  const form = useForm<UserUpdateType>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      avatar: "",
      gender: "",
      email: "",
      address: "",
      phone: "",
      country: "",
      state: "",
      bio: "",
    },
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = form;

  // Set default values from userProfile when it loads
  useEffect(() => {
    if (userProfile) {
      reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        avatar: userProfile.avatar || "",
        gender: userProfile.gender || "",
        email: userProfile.email || "",
        address: userProfile.address || "",
        phone: userProfile.phone || "",
        country: userProfile.country || "",
        state: userProfile.state || "",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile, reset]);

  // Character limit for bio
  const maxLength = 180;
  const bioValue = watch("bio");
  const characterCount = bioValue?.length || 0;

  // Save handler
  const onSubmit = async (data: UserUpdateType) => {
    setUpdating(true);
    try {
      if (data.avatar && data.avatar instanceof File) {
        // Upload the new avatar file
        const formData = new FormData();
        formData.append("file", data.avatar);
        formData.append("key", data.avatar.name);
        formData.append("replace", "true");
        const uploadResponse = await uploadFile(formData);
        data.avatar = uploadResponse.url;
      } else if (data.avatar === null) {
        data.avatar = "";
      }
      await updateProfile(data);
      setUpdating(false);
      toast.success("Profile updated successfully!");
      reset(data);
      setOpen(false);
    } catch (error) {
      setUpdating(false);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <HiOutlinePencilAlt /> Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg sm:max-h-[90vh]  [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          {/* <ProfileBg />
          <Avatar /> */}
          <div className="px-6 pt-4 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Avatar Upload */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-center">
                        <div className="flex flex-col items-center">
                          <FormLabel className="mb-2">Profile Photo</FormLabel>
                          <FormControl>
                            <ImageUploader
                              name={field.name}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter your first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter your last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          value={field.value || ""}
                          className="w-full"
                          defaultCountry="NG"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Selector */}
                <div className="space-y-4">
                  <Label>Location</Label>
                  <LocationSelector
                    defaultCountry={form.watch("country")}
                    defaultState={form.watch("state")}
                    onCountryChange={(country) => {
                      form.setValue("country", country?.name || "");
                    }}
                    onStateChange={(state) => {
                      form.setValue("state", state?.name || "");
                    }}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter your address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        key={field.value} // To reset when value changes
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <div>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="resize-none"
                            maxLength={maxLength}
                          />
                          <div className="mt-1 text-right text-xs text-muted-foreground">
                            {characterCount}/{maxLength}
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" disabled={updating} className="w-full ">
                    {updating ? (
                      <ButtonSpinner label="Completing Profile..." />
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


