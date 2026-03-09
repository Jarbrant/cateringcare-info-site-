/**
 * Secure API endpoint
 * Sanitizes input
 */

import { searchFAQ } from "@/lib/faqSearch";

export async function POST(req: Request) {

  const body = await req.json();

  const question = String(body.question || "")
    .slice(0, 200); // prevent abuse

  if (!question) {
    return Response.json({
      error: "Invalid question"
    }, { status: 400 });
  }

  const result = searchFAQ(question);

  if (!result) {

    return Response.json({
      found: false,
      answer: null
    });
  }

  return Response.json({
    found: true,
    answer: result.content,
    title: result.title
  });
}
