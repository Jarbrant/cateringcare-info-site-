export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight animate-fade-in-up">
          Näringsrik matleverans
          <br />
          <span className="text-green-700">med omtanke</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
          CateringCare levererar god, trygg och näringsrik mat till
          äldreboenden och hemtjänst i hela regionen. Vi sätter kvalitet
          och omsorg i varje måltid.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <a
            href="#tjanster"
            className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition-colors shadow-lg"
          >
            Våra tjänster
          </a>
          <a
            href="#kontakt"
            className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Begär offert
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>HACCP-certifierad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <span>Dagliga leveranser</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <span>Specialkost alltid tillgänglig</span>
          </div>
        </div>
      </div>
    </section>
  );
}
