import React from "react";

/**
 * Renderer for Tiptap JSON.
 * Supports: doc, paragraph, heading(1-3), bulletList, orderedList, listItem,
 * blockquote, captionedImage, captionedYoutube, hardBreak, codeBlock,
 * horizontalRule. Marks: bold, italic, link, code.
 */

function ytEmbed(src) {
  if (!src) return "";
  try {
    const u = new URL(src);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed${u.pathname}`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/shorts/"))
      return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
  } catch {
    /* keep */
  }
  return src;
}

function renderMarks(text, marks, keyBase) {
  if (!marks || marks.length === 0) return text;
  return marks.reduceRight((acc, mark) => {
    if (mark.type === "bold") return <strong key={`${keyBase}-b`}>{acc}</strong>;
    if (mark.type === "italic") return <em key={`${keyBase}-i`}>{acc}</em>;
    if (mark.type === "code")
      return (
        <code
          key={`${keyBase}-c`}
          style={{
            background: "color-mix(in srgb, var(--ink) 8%, transparent)",
            padding: "1px 6px",
            borderRadius: 4,
            fontSize: "0.92em",
          }}
        >
          {acc}
        </code>
      );
    if (mark.type === "link") {
      const href = mark.attrs?.href || "#";
      return (
        <a
          key={`${keyBase}-l`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="tt-link"
        >
          {acc}
        </a>
      );
    }
    return acc;
  }, text);
}

function renderNode(node, key) {
  if (!node) return null;
  const t = node.type;
  const children = (node.content || []).map((c, i) => renderNode(c, `${key}-${i}`));

  switch (t) {
    case "doc":
      return <div key={key}>{children}</div>;
    case "paragraph":
      return (
        <p key={key} className="tt-p">
          {children}
        </p>
      );
    case "heading": {
      const lvl = Math.min(Math.max(node.attrs?.level || 2, 1), 6);
      const Tag = `h${lvl}`;
      return (
        <Tag key={key} className={`tt-h tt-h${lvl}`}>
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="tt-ul">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="tt-ol">
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li key={key} className="tt-li">
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="tt-bq">
          {children}
        </blockquote>
      );
    case "horizontalRule":
      return <hr key={key} className="tt-hr" />;
    case "hardBreak":
      return <br key={key} />;
    case "codeBlock":
      return (
        <pre key={key} className="tt-code">
          <code>{children}</code>
        </pre>
      );

    case "captionedImage":
    case "image": {
      const { src, alt, caption, size = "medium" } = node.attrs || {};
      return (
        <figure
          key={key}
          className={`tt-figure tt-img-figure tt-size-${size}`}
          data-size={size}
        >
          <div className="tt-img-wrap">
            <img src={src} alt={alt || caption || ""} />
          </div>
          {caption ? <figcaption className="tt-caption">{caption}</figcaption> : null}
        </figure>
      );
    }

    case "captionedYoutube":
    case "youtube": {
      const { src, caption } = node.attrs || {};
      if (!src) return null;
      return (
        <figure key={key} className="tt-figure tt-yt-figure">
          <div className="tt-yt-wrap">
            <iframe
              src={ytEmbed(src)}
              title="YouTube"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption ? <figcaption className="tt-caption">{caption}</figcaption> : null}
        </figure>
      );
    }

    case "text":
      return renderMarks(node.text, node.marks, key);
    default:
      return null;
  }
}

export default function TiptapRender({ doc }) {
  if (!doc) return null;
  return <div className="tt-prose">{renderNode(doc, "n")}</div>;
}
