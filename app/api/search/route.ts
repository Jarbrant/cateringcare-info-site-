import { searchFAQ } from "@/lib/faqSearch"

export async function POST(req:Request){

  const body = await req.json()

  const question = String(body.question || "").slice(0,200)

  if(!question){

    return Response.json({error:"question required"},{status:400})

  }

  const result = searchFAQ(question)

  if(!result){

    return Response.json({

      found:false,
      answer:"Jag hittar inget svar. Kontakta din hemtjänst."

    })

  }

  return Response.json({

    found:true,
    title:result.title,
    answer:result.content

  })

}
