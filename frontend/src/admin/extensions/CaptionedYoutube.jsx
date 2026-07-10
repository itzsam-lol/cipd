import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useRef, useEffect } from "react";

function ytEmbed(src) {
  if (!src) return "";
  try {
    const u = new URL(src);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/shorts/")) {
      return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    if (u.pathname.startsWith("/embed/")) return src;
  } catch {
    /* noop */
  }
  return src;
}

function VideoView({ node, updateAttributes, editor, deleteNode }) {
  const { src, caption } = node.attrs;
  const captionRef = useRef(null);
  useEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [caption]);

  return (
    <NodeViewWrapper as="figure" className="tt-figure tt-yt-figure" data-drag-handle>
      <div className="tt-yt-wrap">
        <iframe
          src={ytEmbed(src)}
          title="YouTube"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {editor.isEditable && (
          <div className="tt-img-toolbar" contentEditable={false}>
            <button type="button" onClick={() => deleteNode()} className="tt-img-del" title="Remove">
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
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          rows={1}
        />
      ) : caption ? (
        <figcaption className="tt-caption">{caption}</figcaption>
      ) : null}
    </NodeViewWrapper>
  );
}

const CaptionedYoutube = Node.create({
  name: "captionedYoutube",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-captioned-video]",
        getAttrs: (el) => ({
          src: el.querySelector("iframe")?.getAttribute("src") || "",
          caption: el.querySelector("figcaption")?.textContent || "",
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, caption } = node.attrs;
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-captioned-video": "",
        class: "tt-figure tt-yt-figure",
      }),
      ["div", { class: "tt-yt-wrap" }, ["iframe", { src: ytEmbed(src), frameborder: "0", allowfullscreen: "true" }]],
      ...(caption ? [["figcaption", { class: "tt-caption" }, caption]] : []),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },

  addCommands() {
    return {
      setCaptionedYoutube:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

export default CaptionedYoutube;
