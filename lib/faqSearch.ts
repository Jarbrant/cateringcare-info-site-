import Fuse from "fuse.js"
import { loadFAQs } from "./faqLoader"

export function searchFAQ(question:string){

  const faqs = loadFAQs()

  const fuse = new Fuse(faqs,{
    keys:["title","content"],
    threshold:0.4
  })

  const results = fuse.search(question)

  if(results.length === 0) return null

  return results[0].item

}
