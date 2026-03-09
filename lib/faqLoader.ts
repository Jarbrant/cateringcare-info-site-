/**
 * Loads FAQ markdown files from filesystem
 * Safe server-side code only
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const FAQ_PATH = path.join(process.cwd(), "content/faq");

/**
 * Recursively read FAQ markdown files
 */
export function loadFAQs() {

  const results: any[] = [];

  function walk(dir: string) {

    const files = fs.readdirSync(dir);

    for (const file of files) {

      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!file.endsWith(".md")) continue;

      const fileContent = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContent);

      results.push({
        title: data.title,
        category: data.category,
        keywords: data.keywords || "",
        content
      });
    }
  }

  walk(FAQ_PATH);

  return results;
}
