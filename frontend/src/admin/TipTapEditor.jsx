import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CaptionedImage from "@/admin/extensions/CaptionedImage";
import CaptionedYoutube from "@/admin/extensions/CaptionedYoutube";
import SlashMenu from "@/admin/SlashMenu";
import BubbleToolbar from "@/admin/BubbleToolbar";
import { api } from "@/lib/api";
import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";

const TipTapEditor = forwardRef(function TipTapEditor(
  { value, onChange },
  ref,
) {
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        horizontalRule: { HTMLAttributes: { class: "tt-hr" } },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tt-link" },
      }),
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          if (node.type.name === "heading") return "Heading";
          // Only first paragraph
          const isFirst =
            editor.state.doc.firstChild === node ||
            editor.state.doc.content.firstChild === node;
          return isFirst ? "Tell the story… (type '/' for commands)" : "";
        },
        showOnlyCurrent: false,
      }),
      CaptionedImage,
      CaptionedYoutube,
    ],
    content: value || { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((it) => it.type.startsWith("image/"));
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) uploadImageFromFile(file);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files || []);
        const image = files.find((f) => f.type.startsWith("image/"));
        if (image) {
          event.preventDefault();
          uploadImageFromFile(image);
          return true;
        }
        return false;
      },
    },
  });

  useImperativeHandle(ref, () => ({ editor }), [editor]);

  const uploadImageFromFile = useCallback(
    async (file) => {
      if (!editor) return;
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post("/admin/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = `${process.env.REACT_APP_BACKEND_URL}${data.url}`;
        editor
          .chain()
          .focus()
          .setCaptionedImage({ src: url, alt: file.name, size: "medium" })
          .run();
      } catch (e) {
        window.alert("Image upload failed");
      }
    },
    [editor],
  );

  const onPickImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onImageFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) uploadImageFromFile(file);
      e.target.value = "";
    },
    [uploadImageFromFile],
  );

  const onPickVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Paste a YouTube URL");
    if (!url) return;
    editor.chain().focus().setCaptionedYoutube({ src: url }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div data-testid="tiptap-editor" className="tt-medium-host">
      <BubbleToolbar editor={editor} />

      <EditorContent editor={editor} data-testid="tiptap-content" />

      <SlashMenu editor={editor} onPickImage={onPickImage} onPickVideo={onPickVideo} />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageFile}
        data-testid="tt-image-input"
      />
    </div>
  );
});

export default TipTapEditor;
