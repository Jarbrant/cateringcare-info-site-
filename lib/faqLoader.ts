import fs from "fs"
import path from "path"
import matter from "gray-matter"

const FAQ_DIR = path.join(process.cwd(), "content/faq")

export function loadFAQs() {

  const results:any[] = []

  function walk(dir:string){

    const files = fs.readdirSync(dir)

    for(const file of files){

      const full = path.join(dir,file)

      if(fs.statSync(full).isDirectory()){

        walk(full)
        continue

      }

      if(!file.endsWith(".md")) continue

      const raw = fs.readFileSync(full,"utf8")

      const {data,content} = matter(raw)

      results.push({

        title:data.title,
        category:data.category,
        content

      })

    }

  }

  walk(FAQ_DIR)

  return results

}
