export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold text-white">CateringCare</span>
          </div>
          <p className="text-sm leading-relaxed">
            Näringsrik och trygg matleverans för äldreomsorgen. Vi sätter
            kvalitet och omtanke i varje måltid.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Snabblänkar</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#tjanster" className="hover:text-white transition-colors">
                Våra tjänster
              </a>
            </li>
            <li>
              <a href="#varfor-oss" className="hover:text-white transition-colors">
                Varför oss
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">
                Vanliga frågor
              </a>
            </li>
            <li>
              <a href="#kontakt" className="hover:text-white transition-colors">
                Kontakt
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Kontakt</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 info@cateringcare.se</li>
            <li>📞 070-123 45 67</li>
            <li>📍 Storgatan 12, Stockholm</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-sm">
        © {new Date().getFullYear()} CateringCare AB. Alla rättigheter
        förbehållna.
      </div>
    </footer>
  );
}
