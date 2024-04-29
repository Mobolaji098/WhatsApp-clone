import { useEffect, useState } from "react";
import {
  Avatar,
  useChatContext,
  LoadingChannels as LoadingUsers,
} from "stream-chat-react";
import { UserResource } from "@clerk/types";
import { Channel, UserResponse } from "stream-chat";
import { ArrowLeft } from "lucide-react";
import LoadingButton from "@/components/LoaingButton";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/Button";

interface UserMenuProps {
  user: UserResource;
  onClose: () => void;
  onChannelSelected: () => void;
}

export default function UserMenu({
  user,
  onClose,
  onChannelSelected,
}: UserMenuProps) {
  const { client, setActiveChannel } = useChatContext();
  const [users, setUsers] = useState<(UserResponse & { image?: string })[]>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [moreUsersLoading, setMoreUsersLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounce = useDebounce(searchInput);
  const [endOfPaginationReached, setEndOfPaginationReached] =
    useState<boolean>();

  const pageSize = 10;

  useEffect(() => {
    async function loadInitialUsers() {
      setUsers(undefined);
      setEndOfPaginationReached(undefined);
      // await new Promise((resolve)=> setTimeout(resolve,10000))
      try {
        const response = await client.queryUsers(
          {
            id: { $ne: user.id },
            ...(searchInputDebounce
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounce } },
                    { id: { $autocomplete: searchInputDebounce } },
                  ],
                }
              : {}),
          },
          { id: 1 },
          { limit: pageSize + 1 }
        );

        // const response = await client.queryUsers(
        //   {
        //     id: { $ne: user.id },
        //   },
        //   { id: 1 },
        //   { limit: pageSize + 1 }
        // );
        setUsers(response.users.slice(0, pageSize));
        setEndOfPaginationReached(response.users.length <= pageSize);
      } catch (error) {
        console.error(error);
        alert("Error loading users");
      }
    }
    loadInitialUsers();
  }, [client, user.id, searchInputDebounce]);

  async function loadMoreUsers() {
    setMoreUsersLoading(true);
    try {
      const lastUserId = users?.[users.length - 1].id;
      if (!lastUserId) return;
      const response = await client.queryUsers(
        {
          $and: [
            { id: { $ne: user.id } },
            { id: { $gt: lastUserId } },
            searchInputDebounce
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounce } },
                    { id: { $autocomplete: searchInputDebounce } },
                  ],
                }
              : {},
          ],
        },
        { id: 1 },
        { limit: pageSize + 1 }
      );
      setUsers([...users, ...response.users.slice(0, pageSize)]);
      setEndOfPaginationReached(response.users.length <= pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setMoreUsersLoading(false);
    }
  }

  function handleChannelCreated(channel: Channel) {
    onChannelSelected();
    setActiveChannel(channel);
  }

  async function startChatWithUser(userid: string) {
    try {
      const channel = client.channel("messaging", {
        members: [userid, user.id],
      });
      await channel.create();
      handleChannelCreated(channel);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function startGroupChat(members: string[], name?: string) {
    try {

      const channel = client.channel("messaging", {
        members,
        name,
      });
      await channel.create();
      handleChannelCreated(channel);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className="str-chat absolute z-10 flex h-full w-full flex-col overflow-y-auto border-e border-e-[#DBDDE1] bg-white dark:border-e-gray-800 dark:bg-[#17191c]">
      <div className="flex items-center gap-3 p-3 text-lg font-bold">
        <ArrowLeft onClick={onClose} className="cursor-pointer" /> Users
      </div>
      {/* {!users && <LoadingUsers />} */}

      <input
        type="search"
        placeholder="Search"
        className="m-3 h-10 rounded-full border border-gray-300 px-4 py-2 bg-transparent dark:border-gray-800 dark:text-white"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
      />

      {selectedUsers.length > 0 && (
        <StartGroupChatHeader
          onConfirm={(name) =>
            startGroupChat([...selectedUsers, user.id], name)
          }
          onClearSelection={() => setSelectedUsers([])}
        />
      )}
      {users?.map((user) => (
        <UserResult
          user={user}
          onUserClick={startChatWithUser}
          key={user.id}
          selected={selectedUsers.includes(user.id)}
          onChangeSelected={(selected) => {
            selected
              ? setSelectedUsers([...selectedUsers, user.id])
              : setSelectedUsers(
                  selectedUsers.filter((userId) => userId !== user.id)
                );
          }}
        />
      ))}

      <div>
        {!users && !searchInputDebounce && <LoadingUsers />}
        {!users && searchInputDebounce && "...Searching"}
        {users?.length == 0 && <div>No users found</div>}
      </div>
      {endOfPaginationReached === false && (
        <LoadingButton
          onClick={loadMoreUsers}
          loading={moreUsersLoading}
          className="m-auto mb-3 w-[80%]"
        >
          Load more Users
        </LoadingButton>
      )}
    </div>
  );
}

interface userResultProps {
  user: UserResponse & { image?: string };
  onUserClick: (userid: string) => void;
  selected: boolean;
  onChangeSelected: (selected: boolean) => void;
}

function UserResult({
  user,
  onUserClick,
  selected,
  onChangeSelected,
}: userResultProps) {
  return (
    <button
      className="mb-3 flex w-full flex-row items-center  gap-2 p-2 hover:bg-slate-400 dark:hover:bg-[#1c1e22]"
      onClick={() => onUserClick(user.id)}
    >
      <input
        type={"checkBox"}
        className="mx-1 scale-125"
        checked={selected}
        onChange={(e) => onChangeSelected(e.target.checked)}
        onClick={(e) => e.stopPropagation()}
      ></input>
      <span className="">
        <Avatar image={user.image} name={user.name || user.id} size={40} />
      </span>
      <div className="flex w-full items-center justify-between ">
        <span className="overflow-hidden text-ellipsis ">
          {user.name || user.id}
        </span>

        {user.online && (
          <span className="text-xs text-green-500 "> Online </span>
        )}
      </div>
    </button>
  );
}

interface StartGroupChatHeaderProps {
  onConfirm: (name?: string) => void;
  onClearSelection: () => void;
}

function StartGroupChatHeader({
  onConfirm,
  onClearSelection,
}: StartGroupChatHeaderProps) {
  const [groupChatNameInput, setGroupChatNameInput] = useState("");
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 bg-white p-3 shadow-sm dark:bg-[#17191c]">
      <input
        placeholder="Group name"
        className="border-grey-300 rounded border p-2  dark:bg-transparent dark:border-gray-800"
        value={groupChatNameInput}
        onChange={(e) => {
          setGroupChatNameInput(e.target.value);
        }}
      />
      <div className="flex justify-center gap-2">
        <Button onClick={() => onConfirm(groupChatNameInput)} className="py-2">
          Start group chat
        </Button>

        <Button
          onClick={onClearSelection}
          className="active:bg-grey-500 bg-gray-400 py-2"
        >
          Clear selection
        </Button>
      </div>
    </div>
  );
}
