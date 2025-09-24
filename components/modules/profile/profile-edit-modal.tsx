"use client";

import { useEffect, useId, useState } from "react";
import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";

import { useCharacterLimit } from "@/hooks/use-character-limit";
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
import AvatarUploader from "@/components/custom/avataruploader1";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { ScrollArea } from "@/components/ui/scroll-area";

// Pretend we have initial image files
const initialBgImage = [
  {
    name: "profile-bg.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/profile-bg.jpg",
    id: "profile-bg-123456789",
  },
];

const initialAvatarImage = [
  {
    name: "avatar-72-01.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/avatar-72-01.jpg",
    id: "avatar-123456789",
  },
];

export default function ProfileEditModal() {
  const id = useId();
  const { data: userProfile } = useGetCurrentUserProfile();
  const { mutateAsync: updateProfile, isLoading } = useUpdateUser();
  const [updating, setUpdating] = useState(false);

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
    await updateProfile(data);
  };

  return (
    <Dialog>
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
                            <AvatarUploader
                              label="upload your profile photo"
                              onImageChange={(imageUrl) => {
                                field.onChange(imageUrl);
                              }}
                              defaultImage={
                                typeof field.value === "string"
                                  ? field.value
                                  : undefined
                              }
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

function ProfileBg() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: initialBgImage,
    });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
        {currentImage && (
          <img
            className="size-full object-cover"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />
    </div>
  );
}

function Avatar() {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: initialAvatarImage,
  });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}
