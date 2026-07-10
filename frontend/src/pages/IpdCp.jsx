import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Cpu,
  CircuitBoard,
  Wrench,
  GraduationCap,
  Zap,
  Rocket,
  Cog,
  Hexagon,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";

const ease = [0.16, 1, 0.3, 1];

function SectionFrame({ index, kicker, title, children, testid }) {
  return (
    <section
      data-testid={testid}
      className="relative px-6 sm:px-10 py-28 sm:py-36 border-t"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-baseline justify-between mb-12 sm:mb-16">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
            {index} / 08 — iPD-CP
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
            {kicker}
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="font-display font-extrabold leading-[0.92] tracking-[-0.035em] mb-14 sm:mb-20"
          style={{ fontSize: "clamp(2.5rem, 6.2vw, 6.5rem)" }}
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function Pillar({ icon: Icon, title, copy }) {
  return (
    <div className="max-w-[340px]">
      <span
        className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5"
        style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)" }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--ink)" }} />
      </span>
      <h3 className="font-display font-bold text-[20px] mb-2.5 leading-tight">{title}</h3>
      <p className="text-[15.5px] leading-[1.6] text-ink-2">{copy}</p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div
        className="font-display font-extrabold tracking-[-0.04em] leading-none whitespace-nowrap"
        style={{ fontSize: "clamp(2.25rem, 4vw, 4rem)" }}
      >
        {value}
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ink-3">
        {label}
      </div>
    </div>
  );
}

function PriceRow({ amount, sub, fee, note }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 py-6 border-t"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div>
        <div className="font-display font-bold text-[22px] leading-tight">
          {amount}
        </div>
        <div className="text-[13px] text-ink-3 mt-1.5 uppercase tracking-[0.15em]">
          {sub}
        </div>
      </div>
      <div className="sm:text-right">
        <div className="font-display font-medium text-[18px]">{fee}</div>
        <div className="text-[12px] text-ink-3 mt-1">{note}</div>
      </div>
    </div>
  );
}

export default function IpdCp() {
  return (
    <main
      data-testid="ipdcp-page"
      className="text-ink font-body"
      style={{ overflowX: "clip", background: "var(--bg)" }}
    >
      <Nav />

      {/* HERO 01 / 08 */}
      <section
        data-testid="ipdcp-hero"
        className="relative pt-32 sm:pt-36 pb-20 sm:pb-24 px-6 sm:px-10 overflow-hidden"
      >
        <div
          className="blob"
          style={{
            background: "var(--teal)",
            width: 420,
            height: 420,
            top: 40,
            right: -120,
            opacity: 0.16,
          }}
        />
        <div
          className="blob"
          style={{
            background: "var(--pink)",
            width: 360,
            height: 360,
            bottom: -80,
            left: -100,
            opacity: 0.14,
          }}
        />
        <div className="max-w-[1280px] mx-auto relative">
          <div className="flex items-baseline justify-between mb-12">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
              01 / 08 — iPD-CP
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
              The Accelerator
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease }}
                className="font-display font-extrabold leading-[0.88] tracking-[-0.045em] accent-gradient-text inline-block"
                style={{ fontSize: "clamp(3.25rem, 9vw, 9.5rem)" }}
                data-testid="ipdcp-hero-title"
              >
                iPD-CP.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.25, ease }}
                className="mt-8 max-w-[560px] text-[17px] sm:text-[19px] leading-[1.55] text-ink-2"
              >
                A certificate programme at IIIT Delhi — bridging the gap
                between academic theory and production-ready hardware
                innovation. Built to turn India into a product nation, one
                cohort at a time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.5, ease }}
                className="mt-12 sm:mt-14 grid grid-cols-3 gap-6 sm:gap-10 max-w-[560px]"
              >
                <Stat value="24" label="Weeks intensive" />
                <Stat value="IIIT-D" label="On campus" />
                <Stat value="01" label="Finished product" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease }}
              data-testid="ipdcp-logo"
              className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] shrink-0 mx-auto lg:mx-0"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_cipd-forge/artifacts/8avxrmvo_magic_edit%23TUFITTdOdHZJVUEjMSM4YzcxNmI2YjI3MmZiZjE4ODA5YmUyYTVmMGQ4YzAyMCM1MjkjI1RSQU5TRk9STUFUSU9OX1JFUVVFU1Q.png"
                alt="iPD-CP"
                className="relative w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02 / 08 */}
      <SectionFrame
        testid="ipdcp-section-2"
        index="02"
        kicker="The Curriculum"
        title={
          <>
            Beyond the <br />
            <span className="text-ink-3">simulation.</span>
          </>
        }
      >
        <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[620px] mb-16">
          Modeled on the way industry trains fresh hires — you master the
          entire product development life cycle, not just a slice of it.
        </p>
        <div className="grid sm:grid-cols-3 gap-12">
          <Pillar
            icon={Compass}
            title="Concept to reality"
            copy="From initial ideation and field research all the way to a production-ready prototype in your hand."
          />
          <Pillar
            icon={CircuitBoard}
            title="The technical stack"
            copy="Embedded systems, IoT, PCB design and enclosure design — full stack hardware, end to end."
          />
          <Pillar
            icon={CheckCircle2}
            title="Industry validation"
            copy="Comprehensive testing, validation and production-readiness reviews before anything ships."
          />
        </div>
      </SectionFrame>

      {/* 03 / 08 */}
      <SectionFrame
        testid="ipdcp-section-3"
        index="03"
        kicker="The Mastery Track"
        title={
          <>
            Three tracks. <br />
            One builder.
          </>
        }
      >
        <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[620px] mb-16">
          From users to hardware to code — the three core mastery tracks that
          turn an engineer into a product builder.
        </p>
        <div className="grid lg:grid-cols-3 gap-14">
          <div>
            <div className="text-[60px] font-display font-extrabold leading-none text-ink-3 mb-6">
              01
            </div>
            <h3 className="font-display font-bold text-[24px] mb-3">
              Design Thinking
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-ink-2 max-w-[320px]">
              Surveys, requirement analysis and building products that solve a
              real user problem — not an imagined one.
            </p>
          </div>
          <div>
            <div className="text-[60px] font-display font-extrabold leading-none text-ink-3 mb-6">
              02
            </div>
            <h3 className="font-display font-bold text-[24px] mb-3">
              Embedded Hardware
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-ink-2 max-w-[320px]">
              Circuit design, PCB schematics, fabrication, soldering and
              thermal — the parts most engineers never get to touch.
            </p>
          </div>
          <div>
            <div className="text-[60px] font-display font-extrabold leading-none text-ink-3 mb-6">
              03
            </div>
            <h3 className="font-display font-bold text-[24px] mb-3">
              Firmware & Systems
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-ink-2 max-w-[320px]">
              Bare-metal C, RTOS scheduling, communication protocols and the
              quiet art of writing code that runs for years.
            </p>
          </div>
        </div>
      </SectionFrame>

      {/* 04 / 08 */}
      <SectionFrame
        testid="ipdcp-section-4"
        index="04"
        kicker="Eligibility"
        title={
          <>
            Are you the <br />
            <span className="accent-gradient-text">right fit?</span>
          </>
        }
      >
        <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[620px] mb-16">
          Built for builders at every stage — final-year students, fresh
          graduates, founders and working professionals.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <Pillar
            icon={GraduationCap}
            title="Final-year students"
            copy="Keen on building world-class hardware products before they graduate."
          />
          <Pillar
            icon={Zap}
            title="Recent graduates"
            copy="Looking to boost employability through specialised hardware upskilling."
          />
          <Pillar
            icon={Rocket}
            title="Startups & founders"
            copy="Seeking 'first-time-right' commercialisation strategies for hardware."
          />
          <Pillar
            icon={Cog}
            title="Working professionals"
            copy="Specialised training in embedded systems and product design."
          />
        </div>
      </SectionFrame>

      {/* 05 / 08 */}
      <SectionFrame
        testid="ipdcp-section-5"
        index="05"
        kicker="Voices"
        title={
          <>
            Hear from <br />
            our builders.
          </>
        }
      >
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {[
            {
              name: "Vivek Dagar",
              meta: "Cohort 01 · 2025",
              quote:
                "I came in knowing C. I left having shipped a board, a casing and a firmware stack that survived a four-hour thermal test. The gap between 'I know it' and 'I built it' is real — iPD-CP closes it.",
            },
            {
              name: "Yash Agarwal",
              meta: "Cohort 01 · 2025",
              quote:
                "The honest part is the schedule. Twenty-four weeks of nights where you're forced to defend every design decision against physics and a deadline. You don't graduate — you finish a product.",
            },
          ].map((t) => (
            <figure key={t.name}>
              <Sparkles className="w-5 h-5 text-ink-3 mb-6" />
              <blockquote
                className="font-display font-medium leading-[1.25] tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)" }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 flex items-baseline gap-3">
                <span className="font-display font-bold">{t.name}</span>
                <span className="text-[12px] uppercase tracking-[0.18em] text-ink-3">
                  {t.meta}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </SectionFrame>

      {/* 06 / 08 */}
      <SectionFrame
        testid="ipdcp-section-6"
        index="06"
        kicker="Financial Support"
        title={
          <>
            Scholarships <br />
            & fellowships.
          </>
        }
      >
        <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[620px] mb-16">
          Financial support designed to make the programme accessible from day
          one. Base fee: <span className="text-ink">₹1,25,000 + GST</span>.
        </p>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-4">
              01 · Onboarding Scholarship
            </div>
            <h3 className="font-display font-bold text-[26px] mb-6 leading-tight">
              GPA-based scholarship reducing your effective programme fee.
            </h3>
            <PriceRow
              amount="₹50,000 off"
              sub="GPA ≥ 8.0"
              fee="₹75,000 + GST"
              note="After scholarship"
            />
            <PriceRow
              amount="₹40,000 off"
              sub="GPA ≥ 7.5"
              fee="₹85,000 + GST"
              note="After scholarship"
            />
            <PriceRow
              amount="₹50,000 off"
              sub="Women · GPA ≥ 7.5"
              fee="₹75,000 + GST"
              note="After scholarship"
            />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-4">
              02 · CiPD Product Development Fellowship
            </div>
            <h3 className="font-display font-bold text-[26px] mb-6 leading-tight">
              Performance-based monthly stipend — up to ₹1.5L total.
            </h3>
            <PriceRow
              amount="₹15,000"
              sub="Monthly stipend"
              fee="From month 3"
              note="Onwards"
            />
            <PriceRow
              amount="10 months"
              sub="Duration"
              fee="6 months post-programme"
              note="Continued support"
            />
            <PriceRow
              amount="₹1.5L"
              sub="Total support"
              fee="Maximum"
              note="Active participants"
            />
            <p className="mt-6 text-[13px] text-ink-3 leading-[1.6]">
              Eligibility: all regular, actively engaged participants. Stipend
              begins from the 3rd month and can extend up to 6 months
              post-programme.
            </p>
          </div>
        </div>
      </SectionFrame>

      {/* 07 / 08 */}
      <SectionFrame
        testid="ipdcp-section-7"
        index="07"
        kicker="Beyond the Cohort"
        title={
          <>
            Grants & <br />
            incubation.
          </>
        }
      >
        <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[620px] mb-16">
          For participants turning their product into a startup — four
          channels of funding and support, layered into one runway.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              cap: "Up to ₹2L",
              t: "CiPD Seed Grant",
              s: "For high-potential early-stage startups from the cohort.",
            },
            {
              cap: "Up to ₹5L",
              t: "READY · via IHFC",
              s: "₹25K/mo (graduates) or ₹12K/mo (B.Tech) + ₹5L consumables grant.",
            },
            {
              cap: "₹4L total",
              t: "Entrepreneur in Residence",
              s: "₹30,000/month scholarship with up to ₹4 lakhs in total funding support.",
            },
            {
              cap: "Up to ₹10L",
              t: "NIDHI PRAYAS scheme",
              s: "Significant startup funding for up to one year via the national scheme.",
            },
          ].map((g) => (
            <div key={g.t}>
              <div
                className="font-display font-extrabold tracking-[-0.03em] mb-4"
                style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)" }}
              >
                {g.cap}
              </div>
              <div className="font-display font-bold text-[17px] mb-2">{g.t}</div>
              <p className="text-[14.5px] leading-[1.6] text-ink-2">{g.s}</p>
            </div>
          ))}
        </div>
      </SectionFrame>

      {/* 08 / 08 — Apply */}
      <section
        id="apply"
        data-testid="ipdcp-section-8"
        className="relative px-6 sm:px-10 py-36 sm:py-52 overflow-hidden"
      >
        <div
          className="blob"
          style={{
            background: "var(--purple)",
            width: 460,
            height: 460,
            top: 0,
            left: -120,
            opacity: 0.14,
          }}
        />
        <div
          className="blob"
          style={{
            background: "var(--teal)",
            width: 460,
            height: 460,
            bottom: -120,
            right: -120,
            opacity: 0.14,
          }}
        />
        <div className="max-w-[1280px] mx-auto relative">
          <div className="flex items-baseline justify-between mb-12">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
              08 / 08 — iPD-CP
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
              Reserve your seat
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease }}
            className="font-display font-extrabold leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
          >
            Reserve <br />
            your <span className="accent-gradient-text">seat.</span>
          </motion.h2>

          <div className="mt-16 grid lg:grid-cols-3 gap-12 max-w-[1100px]">
            <Stat value="TBA" label="Next cohort · 2026" />
            <Stat value="31 May" label="Application deadline" />
            <Stat value="Limited" label="Hands-on mentorship" />
          </div>

          <p className="mt-16 max-w-[560px] text-[16px] leading-[1.65] text-ink-2">
            Each cohort is intentionally capped to ensure every builder gets
            real bench time with a mentor. Final application submission
            deadline: <span className="text-ink">31 May 2026</span>.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href="mailto:cipd@iiitd.ac.in?subject=iPD-CP%20application"
              data-testid="ipdcp-apply-btn"
              className="group inline-flex items-center gap-3 rounded-full pl-7 pr-3 py-3 text-[14px] font-medium"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              Apply now
              <span
                className="inline-flex w-8 h-8 rounded-full items-center justify-center group-hover:rotate-45 transition-transform duration-500"
                style={{ background: "color-mix(in srgb, var(--bg) 15%, transparent)" }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
            <Link
              to="/#events"
              data-testid="ipdcp-events-link"
              className="link-underline text-[14px] text-ink-2"
            >
              Scroll to upcoming events
            </Link>
          </div>
        </div>
      </section>

      <Connect />
    </main>
  );
}
