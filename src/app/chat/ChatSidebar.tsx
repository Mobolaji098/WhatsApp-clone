import {
  Avatar,
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useTranslationContext,
} from "stream-chat-react";
import { useUser } from "@clerk/nextjs";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import UserMenu from "./UserMenu";

interface ChatSideBarProps {
  user: UserResource;
  show: boolean;
  onClose: () => void;
  customActiveChannel?:string
}

export default function ChatSidebar({ user, show, onClose,customActiveChannel }: ChatSideBarProps) {
  //   const ChannelPreviewCustom = useCallback(
  //     (props: ChannelPreviewUIComponentProps) => {
  //       <ChannelPreviewMessenger
  //         {...props}
  //         onSelect={() => {
  //           props.setActiveChannel?.(props.channel, props.watchers)
  //           onClose();
  //         }}
  //       />;
  //     },
  //     [onClose]
  //   );

  const [userMenuOpen, setuserMenuOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setuserMenuOpen(false);
    }
  }, [show]);

  const showUserMenu = () => {
    setuserMenuOpen(!userMenuOpen);
  };

  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const {
      channel,
      activeChannel,
      displayImage,
      displayTitle,
      latestMessage,
      setActiveChannel,
    } = props;
    const latestMessageAt = channel.state.last_message_at;
    const isSelected = channel.id === activeChannel?.id;
    const { userLanguage } = useTranslationContext();

    const timestamp = useMemo(() => {
      if (!latestMessageAt) {
        return "";
      }
      const formatter = new Intl.DateTimeFormat(userLanguage, {
        timeStyle: "short",
      });
      return formatter.format(latestMessageAt);
    }, [latestMessageAt, userLanguage]);

    const handleClick = () => {
      onClose();
      setActiveChannel?.(channel);
    };

    return (
      <button
        onClick={handleClick}
        className={`flex w-full flex-1 cursor-pointer items-center gap-4 rounded-sm  p-4 text-left${
          isSelected ? " bg-slate-400" : ""
        }`}
        // disabled={isSelected}
      >
        <img
          className="h-16 w-16 rounded-full object-cover"
          src={displayImage}
          alt=""
        />
        <div className="flex-1">
          <div className="mb-1 flex justify-between gap-2 font-bold">
            {displayTitle}
            <time
              dateTime={latestMessageAt?.toISOString()}
              className="font-normal text-gray-600"
            >
              {timestamp}
            </time>
          </div>
          <div className="overflow-hidden text-gray-600">{latestMessage}</div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`relative w-full flex-col md:max-w-[360px] ${
        show ? "flex" : "hidden"
      }`}
    >
      <MenuBar onUserMenuClick={showUserMenu} />
      {userMenuOpen && (
        <UserMenu
          user={user}
          onClose={() => {
            setuserMenuOpen(false);
          }}
          onChannelSelected={() => {
            setuserMenuOpen(false);
          }}
        />
      )}

      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        sort={{ last_message_at: -1 }}
        options={{ state: true, presence: true, limit: 10 }}
        customActiveChannel={customActiveChannel}
        showChannelSearch
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: { filters: { members: { $in: [user.id] } } },
          },
        }}
        Preview={CustomChannelPreview}
      />
    </div>
  );
}
