/* ==============================
   CateringCare Chat & Språk
   ============================== */

const WORKER_URL = "https://cateringcare-info-site-01.andersmenyit.workers.dev"

const translations = {
  sv: {
    heroTitle:"Trygg matleverans för äldre",
    heroText:"CateringCare levererar näringsrika måltider till personer med biståndsbeslut via hemtjänsten.",
    assistantTitle:"CateringCare Assistent",
    assistantDesc:"Ställ en fråga om leveranser eller fakturor.",
    placeholder:"Skriv din fråga...",
    sendBtn:"Skicka fråga",
    thinking:"Assistenten tänker...",
    error:"Något gick fel, försök igen!",
    card1Title:"Leverans via hemtjänsten",card1Text:"Maten levereras normalt via hemtjänstens personal.",
    card2Title:"Fakturering",card2Text:"Fakturan skickas den 10:e varje månad.",
    card3Title:"Information för anhöriga",card3Text:"Här hittar anhöriga information om leveranser och betalning."
  },
  en: {
    heroTitle:"Safe meal delivery for the elderly",
    heroText:"CateringCare delivers nutritious meals to people with home care assistance.",
    assistantTitle:"CateringCare Assistant",
    assistantDesc:"Ask a question about deliveries or invoices.",
    placeholder:"Type your question...",
    sendBtn:"Send question",
    thinking:"The assistant is thinking...",
    error:"Something went wrong, please try again!",
    card1Title:"Delivery via home care",card1Text:"Meals are delivered by home care staff.",
    card2Title:"Invoicing",card2Text:"The invoice is sent on the 10th of each month.",
    card3Title:"Information for relatives",card3Text:"Here relatives can find information about deliveries and payments."
  },
  ar: {
    heroTitle:"توصيل وجبات آمن لكبار السن",
    heroText:"CateringCare تقدم وجبات مغذية للأشخاص الذين يحتاجون رعاية منزلية.",
    assistantTitle:"مساعد CateringCare",
    assistantDesc:"اطرح سؤالاً حول التوصيل أو الفواتير.",
    placeholder:"...اكتب سؤالك",
    sendBtn:"إرسال السؤال",
    thinking:"...المساعد يفكر",
    error:"حدث خطأ، حاول مرة أخرى!",
    card1Title:"التوصيل عبر الرعاية المنزلية",card1Text:"يتم توصيل الوجبات من قبل موظفي الرعاية المنزلية.",
    card2Title:"الفواتير",card2Text:"يتم إرسال الفاتورة في العاشر من كل شهر.",
    card3Title:"معلومات للأقارب",card3Text:"هنا يمكن للأقارب العثور على معلومات حول التوصيل والدفع."
  },
  fi: {
    heroTitle:"Turvallinen ateriatoimitus ikääntyneille",
    heroText:"CateringCare toimittaa ravitsevia aterioita kotihoidon asiakkaille.",
    assistantTitle:"CateringCare Avustaja",
    assistantDesc:"Kysy kysymys toimituksista tai laskutuksesta.",
    placeholder:"Kirjoita kysymyksesi...",
    sendBtn:"Lähetä kysymys",
    thinking:"Avustaja miettii...",
    error:"Jotain meni pieleen, yritä uudelleen!",
    card1Title:"Toimitus kotihoidon kautta",card1Text:"Ateriat toimitetaan kotihoidon henkilökunnan toimesta.",
    card2Title:"Laskutus",card2Text:"Lasku lähetetään kuukauden 10. päivä.",
    card3Title:"Tietoa omaisille",card3Text:"Täältä omaiset löytävät tietoa toimituksista ja maksuista."
  }
}

let currentLang = "sv"
let chatHistory = []

function setLang(lang) {
  currentLang = lang
  const t = translations[lang]
  document.getElementById("heroTitle").textContent = t.heroTitle
  document.getElementById("heroText").textContent = t.heroText
  document.getElementById("assistantTitle").textContent = t.assistantTitle
  document.getElementById("assistantDesc").textContent = t.assistantDesc
  document.getElementById("question").placeholder = t.placeholder
  document.getElementById("sendBtn").textContent = t.sendBtn
  document.getElementById("card1Title").textContent = t.card1Title
  document.getElementById("card1Text").textContent = t.card1Text
  document.getElementById("card2Title").textContent = t.card2Title
  document.getElementById("card2Text").textContent = t.card2Text
  document.getElementById("card3Title").textContent = t.card3Title
  document.getElementById("card3Text").textContent = t.card3Text

  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"))
  event.target.classList.add("active")
  chatHistory = []
  document.getElementById("chatHistory").innerHTML = ""
}

async function askQuestion() {
  const input = document.getElementById("question")
  const question = input.value.trim()
  if (!question) return

  const chatBox = document.getElementById("chatHistory")
  const t = translations[currentLang]

  chatBox.innerHTML += '<div class="chat-bubble chat-user">' + escapeHtml(question) + '</div>'
  chatBox.innerHTML += '<div class="chat-bubble chat-thinking" id="thinking">' + t.thinking + '</div>'
  input.value = ""
  chatBox.scrollTop = chatBox.scrollHeight

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history: chatHistory, lang: currentLang })
    })
    const data = await res.json()
    const thinking = document.getElementById("thinking")
    if (thinking) thinking.remove()

    chatBox.innerHTML += '<div class="chat-bubble chat-bot">' + formatAnswer(data.answer) + '</div>'
    chatHistory.push({ role: "user", content: question })
    chatHistory.push({ role: "assistant", content: data.answer })
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20)
  } catch (err) {
    const thinking = document.getElementById("thinking")
    if (thinking) thinking.remove()
    chatBox.innerHTML += '<div class="chat-bubble chat-bot">' + t.error + '</div>'
  }
  chatBox.scrollTop = chatBox.scrollHeight
}

function formatAnswer(text) {
  if (!text) return ""
  let safe = escapeHtml(text)
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  safe = safe.replace(/(?<!href="|">)(https?:\/\/[^\s<,)]+)/g, '<a href="$1" target="_blank">$1</a>')
  safe = safe.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>')
  safe = safe.replace(/\n/g, '<br>')
  return safe
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}
