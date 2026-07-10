import { useEffect, useState, useRef, useCallback } from "react";
import { buildSlashItems, filterItems } from "@/admin/extensions/slashItems";

/**
 * Detects "/" at the start of an empty/single-line paragraph and shows
 * a positioned popup menu. Keyboard arrows + Enter to pick.
 */
export default function SlashMenu({ editor, onPickImage, onPickVideo }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [range, setRange] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const items = buildSlashItems({ onPickImage, onPickVideo });
  const filtered = filterItems(items, query);
  const containerRef = useRef(null);

  const compute = useCallback(() => {
    if (!editor) return;
    const { state, view } = editor;
    const { selection } = state;
    if (!selection.empty) return setOpen(false);
    const { $from } = selection;
    // Only inside paragraphs (not headings/lists/quotes/code)
    if ($from.parent.type.name !== "paragraph") return setOpen(false);
    const textBefore = $from.parent.textBetween(0, $from.parentOffset, "\n", " ");
    const match = textBefore.match(/(?:^|\s)\/([\w-]*)$/);
    if (!match) return setOpen(false);
    const q = match[1];
    const slashStart = $from.pos - match[0].length + (match[0].startsWith("/") ? 0 : 1);
    setQuery(q);
    setRange({ from: slashStart, to: $from.pos });
    setActiveIdx(0);
    const coords = view.coordsAtPos($from.pos);
    setPos({ top: coords.bottom + 6, left: coords.left });
    setOpen(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => compute();
    editor.on("selectionUpdate", handler);
    editor.on("update", handler);
    return () => {
      editor.off("selectionUpdate", handler);
      editor.off("update", handler);
    };
  }, [editor, compute]);

  const close = useCallback(() => setOpen(false), []);

  const pick = useCallback(
    (item) => {
      if (!item || !editor || !range) return;
      item.run(editor, range);
      close();
    },
    [editor, range, close],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0,
        );
        return;
      }
      if (e.key === "Enter") {
        if (filtered[activeIdx]) {
          e.preventDefault();
          pick(filtered[activeIdx]);
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, filtered, activeIdx, pick, close]);

  if (!open || filtered.length === 0) return null;

  return (
    <div
      ref={containerRef}
      data-testid="slash-menu"
      className="slash-menu"
      style={{ top: pos.top, left: pos.left }}
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="slash-menu-head">Basic blocks</div>
      <ul>
        {filtered.map((it, i) => {
          const Icon = it.icon;
          return (
            <li
              key={it.id}
              className={i === activeIdx ? "is-active" : ""}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => pick(it)}
            >
              <span className="slash-icon">
                <Icon className="w-4 h-4" />
              </span>
              <span className="slash-text">
                <span className="slash-label">{it.label}</span>
                <span className="slash-hint">{it.hint}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
