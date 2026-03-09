import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "Hur fungerar fakturering?",
    answer:
      "Fakturor skickas månadsvis via e-post eller post. Ni kan även välja autogiro för automatisk betalning.",
  },
  {
    question: "Hur skaffar jag autogiro?",
    answer:
      "Kontakta vår kundtjänst på info@cateringcare.se så skickar vi en autogiroblankett som kan signeras digitalt eller via post.",
  },
  {
    question: "Kan jag beställa specialkost?",
    answer:
      "Ja! Vi erbjuder diabeteskost, proteinrik kost, konsistensanpassad, laktosfri, glutenfri och mycket mer. Alla anpassningar ingår i priset.",
  },
  {
    question: "Hur snabbt kan leveransen starta?",
    answer:
      "Normalt inom 5 arbetsdagar efter signerat avtal. Vid akuta behov kan vi ofta starta snabbare.",
  },
  {
    question: "Vad händer vid matallergier?",
    answer:
      "Alla allergier och överkänsligheter markeras i vårt system och följs strikt genom hela tillagnings- och leveranskedjan.",
  },
  {
    question: "Kan faktura skickas via e-post?",
    answer:
      "Absolut! Ange önskad e-postadress vid beställning så skickar vi PDF-fakturor digitalt.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Vanliga frågor
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Hittar du inte svaret? Använd vår livechat nere till höger!
        </p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
