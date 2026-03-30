import dayjs from "dayjs";
import AvatarAgent from "./AvatarAgent";

function renderSimpleMarkdown(text) {
  const lines = String(text || "").split("\n");
  const blocks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      currentList.push(trimmed.slice(2));
      continue;
    }
    flushList();
    if (trimmed.length) blocks.push({ type: "p", text: line });
  }
  flushList();

  return blocks;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
  status,
  onRetry,
}) {
  const isUser = role === "user";
  const timeText = timestamp ? dayjs(timestamp).format("HH:mm") : "";
  const speaking = status === "typing";

  return (
    <div className={"flex gap-3 " + (isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="pt-0.5">
          <AvatarAgent
            speaking={speaking}
            status={speaking ? "busy" : "online"}
          />
        </div>
      )}

      <div className={"max-w-[82%] sm:max-w-[75%]"}>
        <div
          className={
            "rounded-2xl px-4 py-3 shadow-sm border " +
            (isUser
              ? "bg-indigo-600 text-white border-indigo-600/30"
              : "bg-white/80 backdrop-blur-md text-slate-800 border-white/60")
          }>
          {status === "typing" ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Thinking</span>
              <span className="ai-typing-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {renderSimpleMarkdown(content).map((b, idx) => {
                if (b.type === "list") {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-sm">
                      {b.items.map((it, i) => (
                        <li key={i} className="leading-relaxed">
                          {it}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed whitespace-pre-wrap">
                    {b.text}
                  </p>
                );
              })}

              {status === "error" && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-800">
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={
            "mt-1 flex items-center gap-2 text-[11px] " +
            (isUser ? "justify-end text-slate-400" : "text-slate-400")
          }>
          {timeText && <span>{timeText}</span>}
          {!isUser && <span className="text-slate-500">SSMS AI</span>}
        </div>
      </div>
    </div>
  );
}
