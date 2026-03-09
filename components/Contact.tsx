export default function Contact() {
  return (
    <section id="kontakt" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Kontakta oss
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Vi hjälper er gärna med offert, frågor eller information
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Kontaktinfo */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📧</span>
              <div>
                <h3 className="font-semibold text-gray-900">E-post</h3>
                <a
                  href="mailto:info@cateringcare.se"
                  className="text-green-700 hover:underline"
                >
                  info@cateringcare.se
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">📞</span>
              <div>
                <h3 className="font-semibold text-gray-900">Telefon</h3>
                <a
                  href="tel:+46701234567"
                  className="text-green-700 hover:underline"
                >
                  070-123 45 67
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Adress</h3>
                <p className="text-gray-600">
                  CateringCare AB
                  <br />
                  Storgatan 12
                  <br />
                  123 45 Stockholm
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">🕐</span>
              <div>
                <h3 className="font-semibold text-gray-900">Öppettider</h3>
                <p className="text-gray-600">
                  Mån–Fre: 07:00–16:00
                  <br />
                  Kundtjänst: 08:00–15:00
                </p>
              </div>
            </div>
          </div>

          {/* Kontaktformulär */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Namn
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                E-post
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="din@epost.se"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Meddelande
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                placeholder="Beskriv vad ni behöver hjälp med..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Skicka meddelande
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
