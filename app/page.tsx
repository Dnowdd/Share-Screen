export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 w-lg">
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-neutral-400 font-light">
          Room code
        </label>
        <div className="flex gap-6">
          <div className="flex gap-2">
            <div className="w-14 h-20 rounded-lg border flex items-center justify-center font-bold text-5xl"></div>
            <div className="w-14 h-20 rounded-lg border"></div>
            <div className="w-14 h-20 rounded-lg border"></div>
          </div>

          <div className="flex gap-2">
            <div className="w-14 h-20 rounded-lg border"></div>
            <div className="w-14 h-20 rounded-lg border"></div>
            <div className="w-14 h-20 rounded-lg border"></div>
          </div>
        </div>
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
