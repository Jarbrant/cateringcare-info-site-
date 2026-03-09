/**
 * Accessible accordion component
 */

export default function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group bg-white border border-gray-200 rounded-xl p-5 transition-shadow hover:shadow-md">
      <summary className="font-semibold cursor-pointer text-gray-900 flex justify-between items-center">
        {question}
        <span className="text-green-700 text-xl group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>

      <p className="mt-3 text-gray-600 leading-relaxed">{answer}</p>
    </details>
  );
}
