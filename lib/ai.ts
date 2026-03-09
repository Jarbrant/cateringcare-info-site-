/**
 AI helper
 Uses FAQ context to generate answers
*/

import OpenAI from "openai";

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(question:string, faqContext:string){

 const response = await openai.chat.completions.create({

  model: "gpt-4o-mini",

  messages: [

   {
    role: "system",
    content: `
    You are the support assistant for CateringCare.
    Only answer using the provided FAQ information.
    If you cannot answer, say you cannot find the answer.
    `
   },

   {
    role: "user",
    content: `
    Question: ${question}

    FAQ context:
    ${faqContext}
    `
   }

  ]

 });

 return response.choices[0].message.content;

}
