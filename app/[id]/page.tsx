"use client";

import {
  CornerDownLeft,
  Loader,
  Maximize,
  MessagesCircle,
  Paperclip,
  ScreenShare,
  ScreenShareOff,
  Send,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, type SubmitEvent, useRef } from "react";
import { socket } from "@/lib/socket";

type Message = {
  id: string;
  text: string;
  authorId: string;
  sentAt: number;
};

const Room = () => {
  const { id } = useParams<{ id: string }>();

  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [usersActive, setUsersActive] = useState<number>(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setLocalStream(null);
      });

      setLocalStream(stream);
    } catch {
      return;
    }
  };

  const stopSharing = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit("room:join", id);
    };
    const onDisconnect = () => setIsConnected(false);
    const onMessage = (message: Message) =>
      setMessages((prev) => [...prev, message]);
    const onUsersActive = (usersActive: number) => setUsersActive(usersActive);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat:message", onMessage);
    socket.on("users:active", onUsersActive);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat:message", onMessage);
      socket.off("users:active", onUsersActive);
      socket.disconnect();
    };
  }, [id]);

  const sendMessage = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("chat:message", text);
    setText("");
  };

  return (
    <div className="flex justify-center gap-6 w-full px-20">
      <div className="max-w-7xl w-full flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <Link
            href="/"
            className="font-light flex gap-2 items-center transition border-b border-transparent hover:border-neutral-600"
          >
            <CornerDownLeft className="size-4" /> exit
          </Link>
          <p className="font-bold text-4xl flex items-center gap-2">
            <SquareArrowOutUpRight className="size-4" />
            {id.slice(0, 3)} {id.slice(3, 6)}
          </p>
        </div>

        <div className="bg-neutral-800 aspect-video w-full rounded-xl relative">
          {!localStream && (
            <div className="flex justify-center items-center gap-6 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              <button
                className="transition cursor-pointer rounded-full px-4 py-2 bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-4"
                onClick={startSharing}
              >
                <ScreenShare className="size-4" /> Share screen
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex justify-end gap-2">
          {localStream && (
            <button
              className="transition cursor-pointer rounded-full px-4 py-2 bg-red-500 hover:bg-red-600 flex items-center justify-center gap-4"
              onClick={stopSharing}
            >
              <ScreenShareOff className="size-4" /> Stop sharing
            </button>
          )}
          <div className="size-12 rounded-full bg-neutral-800 shadow flex items-center justify-center">
            <Maximize className="size-5" />
          </div>
          <div
            className="size-12 rounded-full bg-neutral-800 shadow flex items-center justify-center cursor-pointer hover:bg-neutral-700 transition"
            onClick={() => setIsChatVisible(!isChatVisible)}
          >
            <MessagesCircle className="size-5" />
          </div>
        </div>
      </div>
      {isChatVisible && (
        <div className="flex flex-col gap-4">
          <div className="w-120 rounded-xl bg-neutral-800 h-full flex flex-col">
            <div className="flex items-center justify-end px-4 py-4 overflow-x-auto">
              {isConnected && (
                <div className="flex gap-2 items-center py-2 px-2.5 rounded-xl bg-neutral-900/50">
                  <div className="relative">
                    <div
                      className={`h-6 ${usersActive === 1 ? "w-6" : usersActive === 2 ? "w-8" : usersActive >= 3 ? "w-10" : "w-0"}`}
                    ></div>
                    {usersActive >= 1 && (
                      <div className="size-6 bg-blue-500 rounded-full flex justify-center items-center text-xs absolute z-[3] top-0">
                        <User className="size-4" />
                      </div>
                    )}
                    {usersActive >= 2 && (
                      <div className="size-6 bg-red-500 rounded-full flex justify-center items-center text-xs absolute left-2 z-[2] top-0">
                        <User className="size-4" />
                      </div>
                    )}
                    {usersActive >= 3 && (
                      <div className="size-6 bg-purple-500 rounded-full flex justify-center items-center text-xs absolute left-4 z-[1] top-0">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>
                  {usersActive > 3 && <div>{usersActive} users</div>}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
              {messages.map((message) => {
                const isMine = message.authorId === socket.id;

                return (
                  <div
                    key={message.id}
                    className={`max-w-[80%] px-3 py-2 rounded-xl ${
                      isMine
                        ? "self-end bg-blue-600"
                        : "self-start bg-neutral-700"
                    }`}
                  >
                    {message.text}
                  </div>
                );
              })}
            </div>
          </div>
          <form
            onSubmit={sendMessage}
            className="grid grid-cols-[1fr_auto_auto] gap-2"
          >
            <input
              type="text"
              placeholder="Conversar no chat"
              className="h-14 w-full bg-neutral-800 px-6 rounded-xl placeholder:text-neutral-600 focus:outline"
              disabled={!isConnected}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="button"
              disabled={!isConnected}
              className="size-14 bg-neutral-800 flex items-center justify-center rounded-xl"
            >
              <Paperclip className="size-4" />
            </button>
            <button
              type="submit"
              disabled={!isConnected}
              className="size-14 bg-neutral-800 flex items-center justify-center rounded-xl"
            >
              {isConnected ? (
                <Send className="size-4" />
              ) : (
                <Loader className="size-4 animate-spin" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Room;
