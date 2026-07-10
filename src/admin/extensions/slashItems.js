import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  ImageIcon,
  Youtube as YoutubeIcon,
  Code2,
} from "lucide-react";

/**
 * Slash-menu command list. Each item has:
 *   id, label, keywords, icon, run(editor, range)
 * `range` is the {from, to} of the trigger text "/query" to delete.
 */

const replaceWithBlock = (editor, range, kind) => {
  const c = editor.chain().focus().deleteRange(range);
  switch (kind) {
    case "h1":
      return c.setNode("heading", { level: 1 }).run();
    case "h2":
      return c.setNode("heading", { level: 2 }).run();
    case "h3":
      return c.setNode("heading", { level: 3 }).run();
    case "ul":
      return c.toggleBulletList().run();
    case "ol":
      return c.toggleOrderedList().run();
    case "quote":
      return c.toggleBlockquote().run();
    case "divider":
      return c.setHorizontalRule().run();
    case "code":
      return c.toggleCodeBlock().run();
    default:
      return c.run();
  }
};

export function buildSlashItems({ onPickImage, onPickVideo }) {
  return [
    {
      id: "h1",
      label: "Heading 1",
      hint: "Large section title",
      keywords: ["h1", "heading", "title"],
      icon: Heading1,
      run: (editor, range) => replaceWithBlock(editor, range, "h1"),
    },
    {
      id: "h2",
      label: "Heading 2",
      hint: "Subsection title",
      keywords: ["h2", "heading", "subtitle"],
      icon: Heading2,
      run: (editor, range) => replaceWithBlock(editor, range, "h2"),
    },
    {
      id: "h3",
      label: "Heading 3",
      hint: "Smaller heading",
      keywords: ["h3", "heading"],
      icon: Heading3,
      run: (editor, range) => replaceWithBlock(editor, range, "h3"),
    },
    {
      id: "bullets",
      label: "Bulleted list",
      hint: "Simple bullet list",
      keywords: ["bullets", "ul", "unordered", "list"],
      icon: List,
      run: (editor, range) => replaceWithBlock(editor, range, "ul"),
    },
    {
      id: "numbered",
      label: "Numbered list",
      hint: "1. 2. 3.",
      keywords: ["ol", "numbered", "ordered", "list"],
      icon: ListOrdered,
      run: (editor, range) => replaceWithBlock(editor, range, "ol"),
    },
    {
      id: "quote",
      label: "Quote",
      hint: "Block quote",
      keywords: ["quote", "blockquote", "bq"],
      icon: Quote,
      run: (editor, range) => replaceWithBlock(editor, range, "quote"),
    },
    {
      id: "divider",
      label: "Divider",
      hint: "Horizontal line",
      keywords: ["divider", "hr", "rule", "separator"],
      icon: Minus,
      run: (editor, range) => replaceWithBlock(editor, range, "divider"),
    },
    {
      id: "code",
      label: "Code block",
      hint: "Monospace block",
      keywords: ["code", "snippet"],
      icon: Code2,
      run: (editor, range) => replaceWithBlock(editor, range, "code"),
    },
    {
      id: "image",
      label: "Image",
      hint: "Upload from device",
      keywords: ["image", "picture", "photo", "img"],
      icon: ImageIcon,
      run: (editor, range) => {
        editor.chain().focus().deleteRange(range).run();
        onPickImage?.();
      },
    },
    {
      id: "video",
      label: "Video",
      hint: "Embed YouTube link",
      keywords: ["video", "youtube", "embed", "yt"],
      icon: YoutubeIcon,
      run: (editor, range) => {
        editor.chain().focus().deleteRange(range).run();
        onPickVideo?.();
      },
    },
  ];
}

export function filterItems(items, query) {
  if (!query) return items;
  const q = query.toLowerCase().trim();
  return items.filter(
    (it) =>
      it.label.toLowerCase().includes(q) ||
      it.keywords.some((k) => k.toLowerCase().startsWith(q) || k.toLowerCase().includes(q)),
  );
}
