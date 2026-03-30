import { useEffect, useMemo, useRef, useState } from "react";
import { X, Send, Sparkles, RefreshCw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import AvatarAgent from "./AvatarAgent";

export default function ChatWindow({
  open,
  onClose,
  messages,
  sending,
  onSend,
  onRetryLast,
  onRetryMessage,
  assistantStatus = "online",
  title = "SSMS AI Assistant",
}) {
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef(null);

  const canSend = useMemo(() => {
    return !sending && draft.trim().length > 0;
  }, [sending, draft]);

  const canRetryLast = useMemo(() => {
    if (!onRetryLast) return false;
    if (sending) return false;
    const lastAssistant = [...(messages || [])]
      .reverse()
      .find((m) => m.role === "assistant");
    return lastAssistant?.status === "error";
  }, [messages, onRetryLast, sending]);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll to bottom on open / new messages
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length, sending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    const text = draft.trim();
    setDraft("");
    onSend?.(text);
  };

  return (
    <div
      className={
        "fixed z-50 " +
        (open
          ? "pointer-events-auto opacity-100 scale-100"
          : "pointer-events-none opacity-0 scale-95") +
        " transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-right " +
        " inset-0 sm:inset-auto sm:bottom-24 sm:right-6"
      }
      aria-hidden={!open}>
      <div
        className={
          "h-full w-full sm:h-[560px] sm:w-[420px] " +
          "rounded-none sm:rounded-3xl " +
          "bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl " +
          "flex flex-col overflow-hidden"
        }
        role="dialog"
        aria-label="AI Chatbot">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/60 bg-white/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <AvatarAgent speaking={sending} status={assistantStatus} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 truncate">
                    {title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <span
                      className={
                        "w-2 h-2 rounded-full " +
                        (assistantStatus === "busy"
                          ? "bg-amber-400"
                          : assistantStatus === "offline"
                            ? "bg-slate-300"
                            : "bg-emerald-400")
                      }
                      aria-hidden="true"
                    />
                    {assistantStatus === "busy"
                      ? "Thinking"
                      : assistantStatus === "offline"
                        ? "Offline"
                        : "Online"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Ask about attendance, results, fees, schedules, exams, or
                  events.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/70 transition"
              aria-label="Close chatbot">
              <X size={18} className="text-slate-700" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                  <Sparkles className="text-indigo-600" size={20} />
                </div>
                <p className="mt-3 font-semibold text-slate-900">
                  How can I help?
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try: “What is my attendance percentage?” or “When is my next
                  exam?”
                </p>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                timestamp={m.timestamp}
                status={m.status}
                onRetry={
                  m.status === "error" ? () => onRetryMessage?.(m) : undefined
                }
              />
            ))
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-white/60 bg-white/50">
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-2xl bg-white/80 border border-white/60 shadow-sm px-3 py-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={1}
                placeholder="Ask SSMS AI…"
                className="w-full resize-none bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
                <span>Enter to send • Shift+Enter new line</span>
                <span>{Math.min(draft.length, 2000)}/2000</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSend}
              className={
                "h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm border transition " +
                (canSend
                  ? "bg-indigo-600 text-white border-indigo-600/30 hover:bg-indigo-700"
                  : "bg-white/70 text-slate-400 border-white/60")
              }
              aria-label="Send message">
              <Send size={18} />
            </button>

            {canRetryLast && (
              <button
                type="button"
                onClick={onRetryLast}
                className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white/70 text-slate-700 border border-white/60 hover:bg-white/80 transition"
                aria-label="Retry last message"
                title="Retry last message">
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
