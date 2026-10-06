"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Tab" || e.ctrlKey || e.metaKey || e.altKey) return;

      inputRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const enterRoom = (code: string) => {
    if (code.length !== 6) return;

    router.push(`/${encodeURIComponent(code)}`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-lg">
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-neutral-400 font-light">
          Room code
        </label>
        <div className="flex items-center justify-center gap-6">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className={`w-14 h-20 rounded-lg border flex items-center justify-center font-bold text-5xl cursor-text ${isFocused && code.length === index ? "border-neutral-200" : "border-neutral-500"}`}
                onClick={() => {
                  inputRef.current?.focus();
                }}
                key={index}
              >
                {isFocused && code.length === index && (
                  <div className="w-px h-10 animate-pulse bg-neutral-400"></div>
                )}
                {code[index]}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className={`w-14 h-20 rounded-lg border flex items-center justify-center font-bold text-5xl cursor-text ${isFocused && code.length === index + 3 ? "border-neutral-200" : "border-neutral-500"}`}
                onClick={() => {
                  inputRef.current?.focus();
                }}
                key={index + 3}
              >
                {isFocused && code.length === index + 3 && (
                  <div className="w-px h-10 animate-pulse bg-neutral-400"></div>
                )}
                {code[index + 3]}
              </div>
            ))}
          </div>
          {code.length === 6 && (
            <div
              className="size-10 border border-neutral-600 rounded flex items-center justify-center cursor-pointer transition hover:border-neutral-500"
              onClick={() => enterRoom(code)}
            >
              <Send className="size-4" />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          id="code"
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 6),
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && code.length === 6) enterRoom(code);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-neutral-300 text-black absolute top-10000 right-10000"
        />
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="h-px w-full bg-neutral-500"></div>
        <p className="font-light text-neutral-500">or</p>
        <div className="h-px w-full bg-neutral-500"></div>
      </div>

      <div className="flex justify-center items-center">
        <button className="px-6 py-4 rounded-lg border font-light cursor-pointer">
          Create a new room
        </button>
      </div>
    </div>
  );
}
