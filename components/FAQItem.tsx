/**
 * Accessible accordion component
 */

export default function FAQItem({
  question,
  answer
}: {
  question: string,
  answer: string
}) {

  return (

    <details className="border rounded p-4 mb-3">

      <summary className="font-semibold cursor-pointer">
        {question}
      </summary>

      <p className="mt-2 text-gray-700">
        {answer}
      </p>

    </details>
  );
}
