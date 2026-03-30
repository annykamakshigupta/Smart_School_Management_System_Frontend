import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { sendChatMessage } from "../../services/aiChat.service";
import ChatWindow from "./ChatWindow";

const STORAGE_KEY = "ssms_ai_chat_history_v1";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function buildBackendHistory(baseMessages) {
  return (baseMessages || [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => m.status !== "typing")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));
}

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);

  // Hydrate persisted history
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = safeParse(raw, []);
    if (Array.isArray(saved)) setMessages(saved);
  }, []);

  // Persist history (exclude transient typing)
  useEffect(() => {
    const persist = (messages || [])
      .filter((m) => m.status !== "typing")
      .slice(-40)
      .map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        status: m.status,
      }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  }, [messages]);

  const assistantStatus = useMemo(
    () => (sending ? "busy" : "online"),
    [sending],
  );

  const send = useCallback(
    async (text) => {
      const trimmed = String(text || "").trim();
      if (!trimmed) return;

      const baseBeforeSend = messages;
      const userMsg = {
        id: makeId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: "done",
      };
      const typingMsg = {
        id: makeId(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        status: "typing",
      };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setSending(true);

      try {
        const history = buildBackendHistory(baseBeforeSend);
        const res = await sendChatMessage({ message: trimmed, history });
        const reply = res?.data?.reply || "I couldn't generate a response.";

        setMessages((prev) => {
          const next = [...prev];
          const idx = next.findIndex((m) => m.id === typingMsg.id);
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              content: reply,
              status: "done",
              timestamp: new Date().toISOString(),
            };
          }
          return next;
        });
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to reach AI.";
        setMessages((prev) => {
          const next = [...prev];
          const idx = next.findIndex((m) => m.id === typingMsg.id);
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              content: message,
              status: "error",
              timestamp: new Date().toISOString(),
            };
          }
          return next;
        });
      } finally {
        setSending(false);
      }
    },
    [messages],
  );

  const retryLast = useCallback(async () => {
    // Find the last user message index
    const lastUserIdx = [...messages]
      .map((m, idx) => ({ m, idx }))
      .reverse()
      .find((x) => x.m.role === "user")?.idx;

    if (lastUserIdx === undefined) return;
    const lastUser = messages[lastUserIdx];
    if (!lastUser?.content) return;

    const baseHistoryMsgs = messages.slice(0, lastUserIdx);
    const history = buildBackendHistory(baseHistoryMsgs);

    const typingMsg = {
      id: makeId(),
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      status: "typing",
    };

    // Replace the assistant message right after the last user (if present)
    setMessages((prev) => {
      const next = [...prev].filter((m) => m.status !== "typing");
      const afterIdx = lastUserIdx + 1;
      if (next[afterIdx]?.role === "assistant") {
        next[afterIdx] = typingMsg;
        return next;
      }
      return [...next, typingMsg];
    });

    setSending(true);
    try {
      const res = await sendChatMessage({ message: lastUser.content, history });
      const reply = res?.data?.reply || "I couldn't generate a response.";
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findIndex((m) => m.id === typingMsg.id);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            content: reply,
            status: "done",
            timestamp: new Date().toISOString(),
          };
        }
        return next;
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to reach AI.";
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findIndex((m) => m.id === typingMsg.id);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            content: message,
            status: "error",
            timestamp: new Date().toISOString(),
          };
        }
        return next;
      });
    } finally {
      setSending(false);
    }
  }, [messages]);

  const retryMessage = useCallback(async () => {
    await retryLast();
  }, [retryLast]);

  return (
    <>
      <ChatWindow
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        sending={sending}
        onSend={send}
        onRetryLast={retryLast}
        onRetryMessage={retryMessage}
        assistantStatus={assistantStatus}
      />

      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={
            "relative w-14 h-14 rounded-2xl shadow-lg border transition " +
            (open
              ? "bg-white/80 border-white/60 backdrop-blur-xl"
              : "bg-indigo-600 border-indigo-600/30")
          }
          aria-label={open ? "Close chatbot" : "Open chatbot"}>
          <div
            className="absolute inset-0 rounded-2xl ai-chat-glow"
            aria-hidden="true"
          />
          <div className="relative h-full w-full flex items-center justify-center">
            {open ? (
              <Sparkles className="text-indigo-700" size={22} />
            ) : (
              <MessageCircle className="text-white" size={22} />
            )}
          </div>
        </button>

        {!open && (
          <div className="pointer-events-none absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs shadow">
              Ask SSMS AI
            </div>
          </div>
        )}
      </div>
    </>
  );
}
