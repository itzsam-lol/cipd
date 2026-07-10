import { motion } from "framer-motion";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
    caption: "Soldering night, week 3",
    span: "lg:col-span-7 lg:row-span-2 h-[60vh]",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85",
    caption: "First boot",
    span: "lg:col-span-5 h-[30vh]",
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=85",
    caption: "Bench debug, 2 AM",
    span: "lg:col-span-5 h-[30vh]",
  },
  {
    src: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=85",
    caption: "Field test — Manesar",
    span: "lg:col-span-5 h-[40vh]",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85",
    caption: "Cohort 03 lineup",
    span: "lg:col-span-7 h-[40vh]",
  },
];

export default function StudentExperience() {
  return (
    <section
      data-testid="student-experience"
      className="relative px-6 sm:px-10 py-32 sm:py-48"
      style={{ background: "var(--bg-soft-2)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6">
              Student life
            </div>
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              People, <br />
              not slide decks.
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:items-end">
            <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[440px]">
              The best part of CiPD isn&apos;t the equipment — it&apos;s the kind of
              undergrad who shows up at 11 PM with a half-soldered idea, and
              the kind of PhD who pulls up a chair and helps.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
          {IMAGES.map((im, i) => (
            <motion.figure
              key={i}
              data-testid={`student-img-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[18px] group ${im.span}`}
            >
              <img
                src={im.src}
                alt={im.caption}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
              <figcaption className="absolute bottom-5 left-5 text-white text-[12px] uppercase tracking-[0.2em]">
                {im.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
