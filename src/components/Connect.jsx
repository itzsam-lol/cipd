import { Linkedin, Youtube, Instagram, MapPin, Mail, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";

const SOCIAL = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/cipd-iiitd/?originalSubdomain=in",
    label: "LinkedIn",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@anujg1",
    label: "YouTube",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/cipd.iiitd/",
    label: "Instagram",
  },
];

export default function Connect() {
  return (
    <footer
      id="connect"
      data-testid="footer"
      className="relative bg-[#0a0a0b] text-white px-6 sm:px-10 pt-28 sm:pt-40 pb-12"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-6">
              Connect with us
            </div>
            <h2
              className="font-display font-extrabold leading-[0.92] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
            >
              Come <br />
              <span className="accent-gradient-text">build with us.</span>
            </h2>
          <a
            href="mailto:cipd@iiitd.ac.in"
            data-testid="footer-email"
            className="mt-12 inline-flex items-center gap-3 text-[18px] sm:text-[22px] font-display border-b border-white/20 pb-1 hover:border-white transition-colors"
          >
              cipd@iiitd.ac.in
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-4">
                Find us
              </div>
              <div className="flex items-start gap-3 text-white/80 leading-relaxed">
                <MapPin className="w-4 h-4 mt-1 text-white/50" />
                <div>
                  IIIT Delhi <br />
                  Okhla Phase III <br />
                  New Delhi, 110020
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-4">
                Write to us
              </div>
              <div className="flex items-start gap-3 text-white/80 leading-relaxed">
                <Mail className="w-4 h-4 mt-1 text-white/50" />
                <div>
                  cipd@iiitd.ac.in <br />
                  +91 11 2690 7400
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          data-testid="footer-map"
          className="mt-20 rounded-[20px] overflow-hidden border border-white/10 relative"
          style={{ height: 320 }}
        >
          <iframe
            title="IIIT Delhi map"
            src="https://maps.google.com/maps?q=IIIT%20Delhi%2C%20Okhla%20Phase%20III%2C%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full"
            style={{ border: 0, filter: "grayscale(0.7) contrast(1.05)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/90 text-ink text-[11px] uppercase tracking-[0.2em] font-medium pointer-events-none">
            IIIT Delhi · 28.5454° N
          </div>
        </div>

        <div className="mt-16 hairline" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />

        <div className="mt-10 flex flex-col sm:flex-row gap-8 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-auto" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/40 ml-2">
              IIIT Delhi · 2026
            </span>
          </div>
          <div className="flex items-center gap-5">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-testid={`social-${label.toLowerCase()}`}
                data-cursor="hover"
                className="text-white/60 hover:text-white transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
