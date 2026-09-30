import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  ExternalLink,
  Loader2,
  Compass,
} from 'lucide-react';
import { Language } from '../types/travel';

export const N8N_CHAT_WEBHOOK_URL =
  'https://bhagi13.app.n8n.cloud/webhook/d9c5063b-1c1b-439f-9f2e-f9dd4ceb25a5/chat';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface N8nChatWidgetProps {
  language: Language;
  activeDestinationName?: string;
}

function parseN8nResponseText(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return 'Received empty response from travel assistant.';

  // 1. Try standard JSON parse
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'string') return parsed;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const first = parsed[0];
      return (
        first?.output ||
        first?.text ||
        first?.response ||
        first?.message ||
        JSON.stringify(first)
      );
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return (
        parsed.output ||
        parsed.text ||
        parsed.response ||
        parsed.message ||
        parsed.data ||
        JSON.stringify(parsed)
      );
    }
  } catch {
    // 2. Handle n8n streaming NDJSON format (multiple JSON objects separated by newlines)
    const lines = trimmed
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      let combined = '';
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'item' && typeof obj.content === 'string') {
            combined += obj.content;
          } else if (typeof obj.output === 'string') {
            combined += obj.output;
          } else if (typeof obj.text === 'string') {
            combined += obj.text;
          }
        } catch {
          // ignore non-JSON line
        }
      }
      if (combined.trim()) return combined.trim();
    }
  }

  return trimmed;
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  language,
  activeDestinationName = 'Hyderabad',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'native' | 'iframe'>('native');
  const [sessionId, setSessionId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem('itp_n8n_session_id');
      if (existing) return existing;
      const created = `itp-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('itp_n8n_session_id', created);
      return created;
    } catch {
      return `itp-session-${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను మీ ఇండియా ట్రిప్ ప్లానర్ చాట్ అసిస్టెంట్‌ని. హైదరాబాద్, తిరుపతి, విశాఖపట్నం, కేరళ లేదా ఇతర పర్యాటక ప్రదేశాల గురించి నన్ను అడగండి!'
          : `Namaste! I am your India Trip Planner Assistant connected via n8n. Ask me about itineraries, budgets in ₹, best seasons, or travel tips for ${activeDestinationName} and across India!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && viewMode === 'native') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, viewMode]);

  const sendMessageToN8n = async (promptText: string) => {
    const cleanText = promptText.trim();
    if (!cleanText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const payload = {
      action: 'sendMessage',
      sessionId,
      chatInput: cleanText,
    };

    try {
      let replyText = '';
      try {
        const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });

        const raw = await response.text();
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${raw}`);
        }
        replyText = parseN8nResponseText(raw);
      } catch {
        // Fallback through local Express proxy in case of browser CORS restrictions
        const proxyRes = await fetch('/api/n8n-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const rawProxy = await proxyRes.text();
        if (!proxyRes.ok) {
          throw new Error(`Proxy HTTP ${proxyRes.status}`);
        }
        replyText = parseN8nResponseText(rawProxy);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `Unable to reach the live n8n workflow right now. You can switch to the "Hosted View" tab above or open the n8n chat URL directly.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    const nextId = `itp-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSessionId(nextId);
    try {
      localStorage.setItem('itp_n8n_session_id', nextId);
    } catch {
      // ignore
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Started a fresh travel planning session. How can I help you explore India today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    `Plan a 3-day trip to ${activeDestinationName}`,
    'Suggest a budget temple tour in Andhra Pradesh',
    'Best places to visit in Kerala & Goa',
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {isOpen && (
          <div className="mb-3 w-[350px] sm:w-[410px] h-[540px] bg-white border border-stone-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Widget Header */}
            <div className="px-4 py-3.5 bg-stone-900 text-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#C2410C] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-semibold text-white truncate">
                    India Trip Chat Assistant
                  </h3>
                  <p className="text-[11px] text-stone-300 truncate">
                    Powered by n8n Cloud Webhook
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((prev) => (prev === 'native' ? 'iframe' : 'native'))
                  }
                  className="px-2 py-1 text-[11px] font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors whitespace-nowrap"
                  title="Switch between Native Chat & Hosted n8n Embed"
                >
                  {viewMode === 'native' ? 'Hosted View' : 'Native Chat'}
                </button>
                <a
                  href={N8N_CHAT_WEBHOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-stone-300 hover:text-white rounded hover:bg-stone-800 transition-colors"
                  title="Open n8n Chat URL in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="p-1.5 text-stone-300 hover:text-white rounded hover:bg-stone-800 transition-colors"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-300 hover:text-white rounded hover:bg-stone-800 transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === 'iframe' ? (
              /* Direct Embedded Iframe View of the n8n Hosted Chat URL */
              <div className="flex-1 bg-[#FAFAF8] flex flex-col">
                <iframe
                  src={N8N_CHAT_WEBHOOK_URL}
                  title="India Trip Planner n8n Hosted Chat"
                  className="w-full flex-1 border-0"
                  allow="clipboard-write"
                />
                <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                  <span className="truncate">Connected: bhagi13.app.n8n.cloud</span>
                  <button
                    type="button"
                    onClick={() => setViewMode('native')}
                    className="font-semibold text-[#C2410C] hover:underline whitespace-nowrap ml-2"
                  >
                    Use Native Chat UI
                  </button>
                </div>
              </div>
            ) : (
              /* Native Interactive Chat UI Posting to n8n Webhook */
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-[#FAFAF8] space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-[#C2410C] text-white rounded-br-xs'
                            : 'bg-white border border-stone-200/90 text-stone-800 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-stone-200/80 rounded-xl px-3 py-2 w-fit">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C2410C]" />
                      <span>Waiting for n8n travel assistant...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 2 && !isLoading && (
                  <div className="px-3 py-2 bg-stone-50 border-t border-stone-200/70 flex flex-wrap gap-1.5">
                    {quickPrompts.map((qp) => (
                      <button
                        key={qp}
                        type="button"
                        onClick={() => sendMessageToN8n(qp)}
                        className="px-2.5 py-1 text-[11px] bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg transition-colors text-left truncate max-w-full"
                      >
                        {qp}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessageToN8n(input);
                  }}
                  className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'మీ ప్రయాణ ప్రశ్నను ఇక్కడ టైప్ చేయండి...'
                        : 'Ask about destinations, hotels, or itineraries...'
                    }
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C2410C]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                    className="p-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Launcher Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-3 rounded-full bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-lg flex items-center gap-2 text-xs sm:text-sm font-semibold transition-transform hover:scale-102 whitespace-nowrap"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Travel Chat</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'te' ? 'ట్రావెల్ చాట్ (n8n)' : 'Travel Chat Assistant'}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
