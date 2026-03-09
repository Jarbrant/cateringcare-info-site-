import { askAI } from "@/lib/ai";
import { loadFAQs } from "@/lib/faqLoader";

export async function POST(req:Request){

 const body = await req.json();

 const question = String(body.question).slice(0,200);

 const faqs = loadFAQs();

 const context = faqs
  .map(f => `${f.title}\n${f.content}`)
  .join("\n");

 const answer = await askAI(question, context);

 return Response.json({answer});

}
