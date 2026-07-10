/**
 * Reading time estimate for a Tiptap JSON document.
 * Walks all text nodes and counts words; assumes ~220 wpm.
 */
export default function readingTime(doc) {
  if (!doc) return "1 min read";
  let words = 0;
  const walk = (node) => {
    if (!node) return;
    if (node.type === "text" && typeof node.text === "string") {
      words += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
    // captions count too
    if (node.attrs?.caption) {
      words += String(node.attrs.caption).trim().split(/\s+/).filter(Boolean).length;
    }
    (node.content || []).forEach(walk);
  };
  walk(doc);
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}
