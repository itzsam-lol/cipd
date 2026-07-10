import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useRef, useEffect } from "react";

const SIZES = ["small", "medium", "large", "full"];

function ImageView({ node, updateAttributes, editor, selected, deleteNode }) {
  const { src, alt, caption, size } = node.attrs;
  const captionRef = useRef(null);

  // Auto-resize caption textarea
  useEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [caption]);

  const change = (k, v) => updateAttributes({ [k]: v });

  return (
    <NodeViewWrapper
      as="figure"
      className={`tt-figure tt-img-figure tt-size-${size} ${selected ? "is-selected" : ""}`}
      data-drag-handle
    >
      <div className="tt-img-wrap">
        <img src={src} alt={alt || caption || ""} />
        {editor.isEditable && (
          <div className="tt-img-toolbar" contentEditable={false}>
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => change("size", s)}
                className={s === size ? "is-active" : ""}
                title={s}
              >
                {s === "small" && "S"}
                {s === "medium" && "M"}
                {s === "large" && "L"}
                {s === "full" && "F"}
              </button>
            ))}
            <span className="tt-img-sep" />
            <button
              type="button"
              onClick={() => deleteNode()}
              className="tt-img-del"
              title="Remove"
            >
              ×
            </button>
          </div>
        )}
      </div>
      {editor.isEditable ? (
        <textarea
          ref={captionRef}
          className="tt-caption tt-caption-input"
          placeholder="Write a caption (optional)…"
          value={caption || ""}
          onChange={(e) => change("caption", e.target.value)}
          rows={1}
        />
      ) : caption ? (
        <figcaption className="tt-caption">{caption}</figcaption>
      ) : null}
    </NodeViewWrapper>
  );
}

const CaptionedImage = Node.create({
  name: "captionedImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      size: { default: "medium" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-captioned-image]",
        getAttrs: (el) => ({
          src: el.querySelector("img")?.getAttribute("src"),
          alt: el.querySelector("img")?.getAttribute("alt") || "",
          caption: el.querySelector("figcaption")?.textContent || "",
          size: el.getAttribute("data-size") || "medium",
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption, size } = node.attrs;
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-captioned-image": "",
        "data-size": size,
        class: `tt-figure tt-img-figure tt-size-${size}`,
      }),
      ["img", { src, alt: alt || caption || "" }],
      ...(caption ? [["figcaption", { class: "tt-caption" }, caption]] : []),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },

  addCommands() {
    return {
      setCaptionedImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

export default CaptionedImage;
