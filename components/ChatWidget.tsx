"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hej! 👋 Jag kan hjälpa dig med vanliga frågor om CateringCare. Vad undrar du?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();

      if (data.found) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Jag hittar tyvärr inget svar på den frågan. 🤔 Du kan kontakta oss direkt på info@cateringcare.se eller ringa 070-123 45 67 så hjälper vi dig!",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Något gick fel. Försök igen eller kontakta oss på info@cateringcare.se.",
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Snabbfrågor
  const quickQuestions = [
    "Hur fungerar fakturering?",
    "Hur skaffar jag autogiro?",
    "Erbjuder ni specialkost?",
  ];

  return (
    <>
      {/* Toggle-knapp */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-green-800 transition-all hover:scale-105"
        aria-label={isOpen ? "Stäng chat" : "Öppna chat"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chattfönster */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white shadow-2xl rounded-2xl w-[360px] max-h-[500px] flex flex-col border border-gray-200 animate-slide-in-right">
          {/* Header */}
          <div className="bg-green-700 text-white px-5 py-4 rounded-t-2xl">
            <h3 className="font-bold text-lg">CateringCare Support</h3>
            <p className="text-green-100 text-sm">
              Vi svarar vanligtvis direkt ✨
            </p>
          </div>

          {/* Meddelanden */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[300px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-green-700 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-md text-sm">
                  Skriver...
                </div>
              </div>
            )}

            {/* Snabbfrågor (visas bara i början) */}
            {messages.length === 1 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-gray-400">Vanliga frågor:</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => {
                        setInput(q);
                        sendMessage();
                      }, 100);
                    }}
                    className="block w-full text-left text-sm bg-green-50 text-green-800 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ställ en fråga..."
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
