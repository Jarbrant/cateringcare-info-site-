const reasons = [
  {
    stat: "15+",
    label: "Års erfarenhet",
    detail: "Beprövad leverantör inom äldreomsorgscatering",
  },
  {
    stat: "50+",
    label: "Boenden som vi levererar till",
    detail: "Betrodda av kommuner och privata aktörer",
  },
  {
    stat: "99%",
    label: "Leveransprecision",
    detail: "Maten kommer i tid – varje dag",
  },
  {
    stat: "4.8/5",
    label: "Kundbetyg",
    detail: "Baserat på enkäter från personal och anhöriga",
  },
];

export default function WhyUs() {
  return (
    <section
      id="varfor-oss"
      className="py-20 px-6 bg-gradient-to-br from-green-700 to-green-900 text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Varför välja CateringCare?
        </h2>
        <p className="text-green-100 mb-12 max-w-2xl mx-auto">
          Vi brinner för att ge äldre den bästa matupplevelsen – varje dag
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r) => (
            <div key={r.label} className="bg-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="text-4xl font-extrabold mb-2">{r.stat}</div>
              <div className="font-semibold text-lg mb-1">{r.label}</div>
              <div className="text-green-200 text-sm">{r.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
