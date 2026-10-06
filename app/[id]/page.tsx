"use client";

import {
  CornerDownLeft,
  Maximize,
  MessagesCircle,
  Paperclip,
  Send,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const Room = () => {
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex justify-center gap-6 w-full px-20">
      <div className="max-w-7xl w-full flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <Link
            href="/"
            className="font-light flex gap-2 items-center transition border-b border-transparent hover:border-neutral-600"
          >
            <CornerDownLeft className="size-4" /> sair
          </Link>

          <p className="font-bold text-4xl flex items-center gap-2">
            <SquareArrowOutUpRight className="size-4" />
            {id.slice(0, 3)} {id.slice(3, 6)}
          </p>
        </div>

        <div className="bg-neutral-800 aspect-video w-full rounded-xl"></div>

        <div className="flex justify-end gap-2">
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
              <div className="flex gap-2 items-center py-2 px-2.5 rounded-xl bg-neutral-900/50">
                <div className="relative">
                  <div className="h-6 w-10"></div>
                  <div className="size-6 bg-blue-500 rounded-full flex justify-center items-center text-xs absolute z-[3] top-0">
                    DQ
                  </div>
                  <div className="size-6 bg-red-500 rounded-full flex justify-center items-center text-xs absolute left-2 z-[2] top-0">
                    DQ
                  </div>
                  <div className="size-6 bg-purple-500 rounded-full flex justify-center items-center text-xs absolute left-4 z-[1] top-0">
                    DQ
                  </div>
                </div>
                <div>5 users</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <input
              type="text"
              placeholder="Conversar no chat"
              className="h-14 w-full bg-neutral-800 px-6 rounded-xl placeholder:text-neutral-600 focus:outline"
            />
            <button className="size-14 bg-neutral-800 flex items-center justify-center rounded-xl">
              <Paperclip className="size-4" />
            </button>
            <button className="size-14 bg-neutral-800 flex items-center justify-center rounded-xl">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
