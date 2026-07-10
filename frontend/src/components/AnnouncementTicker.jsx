import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AnnouncementTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/announcements")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  const render = (a) =>
    a.link ? (
      <a
        href={a.link}
        target={a.link.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="hover:underline"
      >
        {a.text}
      </a>
    ) : (
      <span>{a.text}</span>
    );

  return (
    <div
      data-testid="announcement-ticker"
      className="w-full h-9 overflow-hidden flex items-center"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      <div className="marquee-track whitespace-nowrap flex gap-10 text-[12px] tracking-[0.04em] px-6">
        {Array.from({ length: 2 }).map((_, k) => (
          <span key={k} className="flex gap-10 shrink-0">
            {items.map((a, i) => (
              <span key={`${k}-${a.id}`} className="flex items-center gap-10">
                {render(a)}
                {i < items.length - 1 && <span className="opacity-40">•</span>}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
