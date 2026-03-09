const services = [
  {
    icon: "🍲",
    title: "Matleverans till äldreboenden",
    description:
      "Dagliga leveranser av varma och kylda måltider anpassade efter näringsbehov. Menyerna roterar veckovis med säsongens råvaror.",
  },
  {
    icon: "🏠",
    title: "Hemtjänstleveranser",
    description:
      "Individuellt portionerad mat levererad direkt hem till brukaren. Enkel att värma och alltid god.",
  },
  {
    icon: "🥗",
    title: "Specialkost & allergier",
    description:
      "Vi hanterar alla typer av specialkost: diabeteskost, proteinrik, konsistensanpassad, laktosfri, glutenfri med mera.",
  },
  {
    icon: "📋",
    title: "Menyplanering",
    description:
      "Våra dietister skapar balanserade menyer som följer Livsmedelsverkets rekommendationer för äldre.",
  },
  {
    icon: "🎉",
    title: "Evenemangscatering",
    description:
      "Beställ catering till högtider, firanden och personalevents. Bufféer och à la carte anpassat efter era önskemål.",
  },
  {
    icon: "📊",
    title: "Uppföljning & kvalitet",
    description:
      "Vi följer löpande upp nöjdheten och anpassar menyer efter feedback från boende och personal.",
  },
];

export default function Services() {
  return (
    <section id="tjanster" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Våra tjänster
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Allt ni behöver för trygg och god kosthållning inom äldreomsorgen
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
