import { useEffect, useState, useRef } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, Quote, Link as LinkIcon } from "lucide-react";

/** Custom selection bubble menu — appears above non-empty text selection. */
export default function BubbleToolbar({ editor }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { state, view } = editor;
      const { from, to, empty } = state.selection;
      if (empty || from === to) {
        setOpen(false);
        return;
      }
      // Only show for text-like selections
      const node = state.selection.$from.parent;
      if (node && node.type.name === "captionedImage") {
        setOpen(false);
        return;
      }
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const left = (start.left + end.left) / 2;
      const top = Math.min(start.top, end.top) - 8;
      setPos({ top, left });
      setOpen(true);
    };
    editor.on("selectionUpdate", update);
    editor.on("blur", () => setOpen(false));
    return () => {
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = (active) =>
    `inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
      active ? "bg-white/20 text-white" : "text-white/85 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div
      ref={ref}
      data-testid="bubble-toolbar"
      className={`tt-bubble-wrap ${open ? "is-open" : ""}`}
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="tt-bubble">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <span className="tt-bubble-sep" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))} title="H1">
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="H2">
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="H3">
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Quote">
          <Quote className="w-3.5 h-3.5" />
        </button>
        <span className="tt-bubble-sep" />
        <button type="button" onClick={setLink} className={btn(editor.isActive("link"))} title="Link">
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
