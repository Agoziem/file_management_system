// components/notifications/NotificationCard.tsx
"use client";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GoDotFill } from "react-icons/go";
import moment from "moment";
import { NotificationResponse } from "@/types/notifications";
import { UserModel } from "@/types/user";

type Props = {
  notification: NotificationResponse;
  userProfile: UserModel | undefined;
  onClick: (notification: NotificationResponse) => void;
  onRemove: (notification: NotificationResponse) => void;
};

const NotificationCard = ({
  notification,
  userProfile,
  onClick,
  onRemove,
}: Props) => {
  const isRead = notification.recipients.some(
    (recipient) =>
      recipient.id === userProfile?.id && recipient.has_read === true
  );

  const isRecipient = notification.recipients.some(
    (recipient) => recipient.id === userProfile?.id
  );

  if (!isRecipient) return null;

  return (
    <div
      className="p-4 mb-4 border rounded-lg hover:bg-muted cursor-pointer flex justify-between items-center"
      onClick={() => onClick(notification)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4 flex items-center gap-2">
          <GoDotFill
            className={isRead ? "text-muted-foreground" : "text-primary"}
            size={20}
          />

          {notification.image && (
            <div className="hidden md:block rounded-lg overflow-hidden w-14 h-14">
              <Image
                src={notification.image}
                alt="Notification Image"
                height={50}
                width={50}
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
        </div>
        <div>
          <h2
            className={
              isRead
                ? "font-semibold text-muted-foreground"
                : "font-semibold text-primary"
            }
          >
            {notification.title}
          </h2>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <span className="text-xs text-muted-foreground">
            {moment(notification.created_at).fromNow()}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div onClick={(e) => e.stopPropagation()} className="cursor-pointer">
            <BsThreeDotsVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-[180px]"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              onClick(notification);
            }}
            className="cursor-pointer"
          >
            View Details
          </DropdownMenuItem>

          {!isRead && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                onClick(notification);
              }}
              className="cursor-pointer"
            >
              Mark as Read
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              onRemove(notification);
            }}
            className="cursor-pointer"
          >
            Remove Notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    </div>
  );
};

export default NotificationCard;
