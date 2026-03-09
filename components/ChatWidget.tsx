"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

// FAQ-databas direkt i klienten (ingen server behövs)
const faqData = [
  {
    keywords: ["faktura", "fakturering", "betala", "betalning", "pris", "kostnad"],
    question: "Hur fungerar fakturering?",
    answer:
      "Fakturor skickas månadsvis via e-post eller post. Ni kan även välja autogiro för automatisk betalning. Kontakta oss på info@cateringcare.se för frågor om fakturor.",
  },
  {
    keywords: ["autogiro", "auto", "giro", "automatisk"],
    question: "Hur skaffar jag autogiro?",
    answer:
      "Kontakta vår kundtjänst på info@cateringcare.se så skickar vi en autogiroblankett. Den kan signeras digitalt eller via post. När autogiro är aktivt dras fakturan automatiskt varje månad.",
  },
  {
    keywords: ["specialkost", "special", "diet", "diabetes", "vegetarisk", "vegan", "laktos", "gluten"],
    question: "Kan jag beställa specialkost?",
    answer:
      "Ja! Vi erbjuder diabeteskost, proteinrik kost, konsistensanpassad (timbal, gelé, flytande), laktosfri, glutenfri, vegetarisk och vegansk kost. Alla anpassningar ingår i priset.",
  },
  {
    keywords: ["leverans", "starta", "börja", "tid", "snabbt", "hur lång"],
    question: "Hur snabbt kan leveransen starta?",
    answer:
      "Normalt inom 5 arbetsdagar efter signerat avtal. Vid akuta behov kan vi ofta starta snabbare – kontakta oss direkt!",
  },
  {
    keywords: ["allergi", "allergier", "överkänslighet", "nötter", "ägg", "mjölk"],
    question: "Vad händer vid matallergier?",
    answer:
      "Alla allergier registreras i vårt system och följs strikt genom hela tillagnings- och leveranskedjan. Vi dubbelkontrollerar alltid innan maten skickas ut.",
  },
  {
    keywords: ["epost", "e-post", "email", "digital", "pdf", "faktura mail"],
    question: "Kan faktura skickas via e-post?",
    answer:
      "Absolut! Ange önskad e-postadress vid beställning så skickar vi PDF-fakturor digitalt till er.",
  },
  {
    keywords: ["meny", "mat", "lunch", "middag", "måltid", "äta"],
    question: "Hur ser menyerna ut?",
    answer:
      "Våra dietister skapar balanserade menyer som följer Livsmedelsverkets rekommendationer. Menyerna roterar veckovis med säsongens råvaror. Kontakta oss för aktuell meny!",
  },
  {
    keywords: ["kontakt", "telefon", "ring", "nå", "öppettider"],
    question: "Hur kontaktar jag er?",
    answer:
      "E-post: info@cateringcare.se | Telefon: 070-123 45 67 | Öppettider: Mån–Fre 07:00–16:00, Kundtjänst 08:00–15:00.",
  },
];

function findAnswer(query: string): string | null {
  const q = query.toLowerCase();
  let bestMatch: (typeof faqData)[0] | null = null;
  let bestScore = 0;

  for (const faq of faqData) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 && bestMatch ? bestMatch.answer : null;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hej! 👋 Jag kan hjälpa dig med vanliga frågor om CateringCare. Vad undrar du?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(overrideText?: string) {
    const text = overrideText || input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", text };
    const answer = findAnswer(text);

    const botMsg: Message = {
      role: "bot",
      text:
        answer ||
        "Jag hittar tyvärr inget svar på den frågan. 🤔 Du kan kontakta oss direkt på info@cateringcare.se eller ringa 070-123 45 67 så hjälper vi dig!",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

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
            <p className="text-green-100 text-sm">Vi svarar direkt ✨</p>
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

            {/* Snabbfrågor */}
            {messages.length === 1 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-gray-400">Vanliga frågor:</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
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
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
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
