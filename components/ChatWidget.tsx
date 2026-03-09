"use client";

import { useState } from "react";

export default function ChatWidget() {

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {

    if (!input.trim()) return;

    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input })
    });

    const data = await res.json();

    const newMessages = [...messages, {
      role: "user",
      text: input
    }];

    if (data.found) {
      newMessages.push({
        role: "bot",
        text: data.answer
      });
    } else {
      newMessages.push({
        role: "bot",
        text: "Jag hittar inget svar. Klicka här för att chatta med oss."
      });
    }

    setMessages(newMessages);
    setInput("");
  }

  return (

    <div className="fixed bottom-6 right-6 bg-white shadow-lg p-4 w-80 rounded-xl">

      <div className="h-60 overflow-auto mb-3">

        {messages.map((m,i)=>(
          <div key={i} className="mb-2">
            <strong>{m.role === "user" ? "Du" : "Support"}:</strong>
            <p>{m.text}</p>
          </div>
        ))}

      </div>

      <input
        className="border p-2 w-full"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Ställ en fråga..."
      />

      <button
        onClick={sendMessage}
        className="bg-green-700 text-white w-full mt-2 p-2 rounded"
      >
        Skicka
      </button>

    </div>
  );
}
