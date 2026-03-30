import { useMemo } from "react";

export default function AvatarAgent({ speaking = false, status = "online" }) {
  const statusClass = useMemo(() => {
    if (status === "busy") return "bg-amber-400";
    if (status === "offline") return "bg-slate-300";
    return "bg-emerald-400";
  }, [status]);

  return (
    <div className="relative shrink-0">
      <div
        className={
          "ai-avatar w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 ring-1 ring-white/70 shadow-sm " +
          (speaking ? "ai-avatar-speaking" : "")
        }
        aria-hidden="true">
        {/* Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-7 h-7 rounded-2xl bg-white/20 backdrop-blur-sm">
            <div className="ai-avatar-eyes absolute inset-0 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1.5 w-3.5 h-[2px] rounded-full bg-white/70" />
          </div>
        </div>
      </div>

      {/* Status dot */}
      <div
        className={
          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white " +
          statusClass
        }
        aria-hidden="true"
      />
    </div>
  );
}
