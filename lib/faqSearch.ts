/**
 * Fuse.js fuzzy search
 * prevents direct user input injection
 */

import Fuse from "fuse.js";
import { loadFAQs } from "./faqLoader";

export function searchFAQ(query: string) {

  const faqs = loadFAQs();

  const fuse = new Fuse(faqs, {
    keys: ["title", "content", "keywords"],
    threshold: 0.4
  });

  const results = fuse.search(query);

  if (!results.length) return null;

  return results[0].item;
}
