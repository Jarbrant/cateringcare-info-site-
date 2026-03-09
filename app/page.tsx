import ChatWidget from "@/components/ChatWidget";

export default function Home() {

  return (

    <main className="p-10 max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        CateringCare
      </h1>

      <p className="text-lg mb-6">
        Näringsrik och trygg matleverans för äldreomsorgen.
      </p>

      <section className="mb-10">

        <h2 className="text-2xl font-semibold">
          Information för anhöriga
        </h2>

        <ul className="list-disc ml-6 mt-4">

          <li>Hur fungerar fakturor?</li>
          <li>Hur skaffar man autogiro?</li>
          <li>Kan faktura skickas via e-post?</li>

        </ul>

      </section>

      <ChatWidget />

    </main>
  );
}
