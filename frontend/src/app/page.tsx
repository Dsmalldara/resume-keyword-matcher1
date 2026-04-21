"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const serif = { fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" };

const features = [
  {
    no: "01",
    title: "Match Score Analysis",
    body: "Real-time alignment and a detailed anatomy of every percentage point.",
  },
  {
    no: "02",
    title: "Keyword Insights",
    body: "The missing vocabulary, recovered — for ATS readability and relevance.",
  },
  {
    no: "03",
    title: "Resume Management",
    body: "An archive for drafts, revisions, and application histories.",
  },
  {
    no: "04",
    title: "AI Cover Letters",
    body: "Composed to the letter of the job, in the tone of the trade.",
  },
  {
    no: "05",
    title: "Performance Analytics",
    body: "Trends across a season of applications, plainly reported.",
  },
  {
    no: "06",
    title: "Resume History",
    body: "Side-by-side comparisons of what worked, and when.",
  },
];

const figures = [
  { num: "10,000", label: "Resumes read, rewritten, returned" },
  { num: "85%", label: "Interview rate for subscribers" },
  { num: "92%", label: "Median keyword alignment" },
];

const chapters = [
  {
    no: "I.",
    title: "Upload",
    body: "A single file — PDF or DOCX — is all we ask. The rest we read on our own time.",
  },
  {
    no: "II.",
    title: "Analyse",
    body: "The system returns your resume to you, annotated. Nothing is hidden from view.",
  },
  {
    no: "III.",
    title: "Apply",
    body: "With a revised draft and a letter to match, you write the next chapter yourself.",
  },
];

const keywords = [
  { word: "strategic planning", missing: true },
  { word: "cross-functional", missing: true },
  { word: "stakeholder management", missing: true },
  { word: "OKRs", missing: true },
  { word: "roadmap", missing: false },
  { word: "data-informed", missing: false },
  { word: "P&L", missing: false },
  { word: "SaaS", missing: false },
  { word: "growth", missing: false },
];

const metrics = [
  { label: "Keyword Match", value: 87 },
  { label: "ATS Readability", value: 92 },
  { label: "Tone Alignment", value: 78 },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* MASTHEAD */}
      <nav className="sticky top-0 z-50 border-b border-foreground/15 backdrop-blur-md bg-background/85">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.svg"
                alt="Resume Matcher"
                width={24}
                height={24}
              />
              <span className="text-[11px] sm:text-xs tracking-[0.24em] uppercase font-medium">
                Resume Matcher
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-foreground/55">
              <span>Vol. I</span>
              <span className="text-foreground/30">·</span>
              <span>No. 04</span>
              <span className="text-foreground/30">·</span>
              <span>Spring 2026</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] uppercase tracking-[0.24em]"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="text-[10px] uppercase tracking-[0.24em] rounded-none"
                >
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* COVER — HERO */}
      <section className="border-b border-foreground/15">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 md:py-24 lg:py-28">
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground/55 mb-7 flex items-center gap-4">
                <span>The Career Briefing</span>
                <span className="h-px w-10 bg-foreground/30" />
                <span>Cover Feature</span>
              </div>
              <h1
                style={serif}
                className="text-[42px] sm:text-6xl lg:text-[92px] xl:text-[104px] leading-[0.92] tracking-tight mb-10 font-semibold"
              >
                The Science of
                <br />
                <em className="italic text-primary">Being Seen</em>
                <span className="text-foreground/50"> —</span>
                <br />
                in an age of algorithms.
              </h1>
              <p className="text-base md:text-lg text-foreground/75 max-w-xl leading-[1.7]">
                <span
                  style={serif}
                  className="float-left text-[76px] md:text-[88px] leading-[0.78] pr-3 pt-2 text-primary font-semibold"
                >
                  A
                </span>
                resume is no longer a document. It is a signal, parsed in
                milliseconds by systems trained on a thousand other applicants.
                This issue: how to write for the reader you cannot see — and be
                recognised by the reader you can.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-12">
                <Button
                  onClick={() => router.push("/auth/signup")}
                  size="lg"
                  className="rounded-none text-[10px] uppercase tracking-[0.28em] h-12 px-8"
                >
                  Begin Reading
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("contents")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-[10px] uppercase tracking-[0.28em] border-b border-foreground/40 pb-1 hover:border-foreground hover:text-foreground text-foreground/70 transition-colors"
                >
                  In this issue
                </button>
              </div>
            </div>

            <aside className="col-span-12 md:col-span-4 md:border-l border-foreground/15 md:pl-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-5">
                From the Editor
              </p>
              <p
                style={serif}
                className="text-xl md:text-2xl italic text-foreground/85 leading-snug"
              >
                &ldquo;The finest resumes are rarely the loudest. They are,
                almost always, the ones that were read twice.&rdquo;
              </p>
              <div className="mt-10 h-px bg-foreground/15" />
              <p className="mt-8 text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-3">
                Issue palette
              </p>
              <div className="flex gap-2">
                <span className="w-9 h-9 rounded-full bg-primary border border-foreground/10" />
                <span className="w-9 h-9 rounded-full bg-[#c9a27a] border border-foreground/10" />
                <span className="w-9 h-9 rounded-full bg-[#3a4a3e] border border-foreground/10" />
                <span className="w-9 h-9 rounded-full bg-foreground border border-foreground/10" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* PULL FIGURES */}
      <section className="border-b border-foreground/15 bg-[#f8f3ea] dark:bg-card/50">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-16">
            {figures.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <span
                  style={serif}
                  className="text-6xl md:text-7xl lg:text-[88px] font-medium leading-[0.95] tracking-tight"
                >
                  {f.num}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-foreground/60 mt-5 max-w-[220px] leading-relaxed">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENTS */}
      <section id="contents" className="border-b border-foreground/15">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8 lg:gap-14">
            <div className="col-span-12 md:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55 mb-6">
                Contents
              </p>
              <h2
                style={serif}
                className="text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-medium"
              >
                In this issue —<br />
                <em className="italic text-foreground/70">six departments.</em>
              </h2>
              <p className="mt-7 text-sm text-foreground/65 leading-[1.7] max-w-sm">
                Every article on this page is a feature of the product. Read in
                order, or step in where your curiosity takes you.
              </p>
            </div>
            <ol className="col-span-12 md:col-span-8 divide-y divide-foreground/15 border-t border-foreground/15">
              {features.map((f) => (
                <li
                  key={f.no}
                  className="group flex items-baseline gap-6 py-6 md:py-7 cursor-pointer hover:bg-foreground/[0.015] transition-colors -mx-4 px-4"
                >
                  <span
                    style={serif}
                    className="text-xl md:text-2xl text-foreground/35 w-10 shrink-0 tabular-nums"
                  >
                    {f.no}
                  </span>
                  <div className="flex-1">
                    <h3
                      style={serif}
                      className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight"
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm text-foreground/65 mt-1.5 max-w-xl leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURE 01 */}
      <section className="border-b border-foreground/15">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="col-span-12 md:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55 mb-5">
                Feature · 01
              </p>
              <h2
                style={serif}
                className="text-4xl md:text-5xl lg:text-6xl leading-[1] font-medium mb-6"
              >
                A resume,{" "}
                <em className="italic text-primary">read back to you.</em>
              </h2>
              <p className="text-sm md:text-base text-foreground/65 leading-[1.7] max-w-md">
                In which the machine shows its work — the phrases it found, the
                ones it couldn&rsquo;t, and where, precisely, the signal
                weakens.
              </p>
            </div>
            <div className="col-span-12 md:col-span-7">
              <p className="text-base md:text-lg text-foreground/85 leading-[1.8] mb-10">
                The machine that reads your resume first is not the hiring
                manager. It is a parser — indifferent to narrative, allergic to
                metaphor. Our analysis returns to you what it sees, phrase by
                phrase, skill by skill, so the next line you write is aimed at
                a target you can finally, clearly, see.
              </p>
              <div className="border border-foreground/15 p-6 md:p-8 bg-card">
                <div className="flex items-baseline justify-between mb-7 pb-4 border-b border-foreground/15">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                    Analysis Sheet
                  </span>
                  <span
                    style={serif}
                    className="text-xs italic text-foreground/55"
                  >
                    specimen
                  </span>
                </div>
                <div className="space-y-6">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm">{m.label}</span>
                        <span
                          style={serif}
                          className="text-2xl font-medium tabular-nums"
                        >
                          {m.value}
                          <span className="text-sm text-foreground/50 ml-0.5">
                            %
                          </span>
                        </span>
                      </div>
                      <div className="h-px bg-foreground/15 relative overflow-visible">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${m.value}%` }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                          viewport={{ once: true }}
                          className="absolute inset-y-0 left-0 bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="border-b border-foreground/15 bg-[#f8f3ea] dark:bg-card/40">
        <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-24 md:py-32 text-center">
          <span className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">
            — An editor&rsquo;s note —
          </span>
          <blockquote
            style={serif}
            className="mt-8 text-3xl md:text-5xl lg:text-6xl leading-[1.1] font-medium"
          >
            &ldquo;The finest resume is not the one that says the most, but the
            one that is{" "}
            <em className="italic text-primary">read most carefully.</em>
            &rdquo;
          </blockquote>
          <p className="mt-10 text-[10px] uppercase tracking-[0.28em] text-foreground/55">
            — from the masthead
          </p>
        </div>
      </section>

      {/* FEATURE 02 — flipped */}
      <section className="border-b border-foreground/15">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="col-span-12 md:col-span-7 md:order-2">
              <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55 mb-5">
                Feature · 02
              </p>
              <h2
                style={serif}
                className="text-4xl md:text-5xl lg:text-6xl leading-[1] font-medium mb-8"
              >
                The language{" "}
                <em className="italic text-primary">
                  they were listening for.
                </em>
              </h2>
              <p className="text-base md:text-lg text-foreground/85 leading-[1.8]">
                Hiring rarely fails on merit; more often, on vocabulary. We
                read the description, recover the phrases it was built on, and
                hand them back to you in order of their weight — with quiet
                suggestions for where, in your own voice, they might be
                answered.
              </p>
            </div>
            <aside className="col-span-12 md:col-span-5 md:order-1">
              <div className="border border-foreground/15 p-6 md:p-8 bg-card">
                <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-6 pb-4 border-b border-foreground/15">
                  Recovered Vocabulary
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw.word}
                      className={
                        kw.missing
                          ? "text-xs px-3 py-1.5 border border-primary/60 text-primary bg-primary/[0.06]"
                          : "text-xs px-3 py-1.5 border border-foreground/20 text-foreground/65"
                      }
                    >
                      {kw.word}
                    </span>
                  ))}
                </div>
                <div className="mt-7 pt-5 border-t border-foreground/15 text-xs text-foreground/60 flex items-baseline justify-between">
                  <span>
                    <span className="text-primary font-medium">4 missing</span>
                    , highlighted
                  </span>
                  <span className="text-foreground/50">
                    5 already present
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* THE METHOD — CHAPTERS */}
      <section className="border-b border-foreground/15 bg-card/40">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55 mb-5">
              The Method
            </p>
            <h2
              style={serif}
              className="text-4xl md:text-5xl lg:text-6xl leading-[1] font-medium"
            >
              In three <em className="italic text-primary">short chapters.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/15 border-y border-foreground/15">
            {chapters.map((c, i) => (
              <motion.div
                key={c.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="px-6 md:px-10 py-10 md:py-12"
              >
                <span
                  style={serif}
                  className="text-5xl md:text-6xl italic text-primary font-medium leading-none"
                >
                  {c.no}
                </span>
                <h3
                  style={serif}
                  className="text-2xl md:text-3xl font-medium mt-5"
                >
                  {c.title}
                </h3>
                <p className="text-sm text-foreground/70 mt-3 leading-[1.7] max-w-xs">
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COLOPHON / CTA */}
      <section className="border-b border-foreground/15">
        <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-24 md:py-36 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">
            — The Invitation —
          </p>
          <h2
            style={serif}
            className="text-4xl md:text-6xl lg:text-7xl leading-[1] font-medium mt-8"
          >
            Begin a quieter,
            <br />
            <em className="italic text-primary">more considered search.</em>
          </h2>
          <p className="text-base md:text-lg text-foreground/75 max-w-lg mx-auto mt-8 leading-[1.7]">
            Your next draft deserves a patient reader. We are waiting in the
            margins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 mt-14">
            <Button
              size="lg"
              onClick={() => router.push("/auth/signup")}
              className="rounded-none text-[10px] uppercase tracking-[0.28em] h-12 px-10"
            >
              Create Your Account
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-[10px] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground underline underline-offset-8 decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              Returning reader? Sign in
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER — MASTHEAD */}
      <footer className="py-14 px-6 lg:px-10">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/favicon.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="text-[11px] tracking-[0.24em] uppercase font-medium">
                  Resume Matcher
                </span>
              </div>
              <p
                style={serif}
                className="text-xl md:text-2xl italic text-foreground/70 max-w-xs leading-tight"
              >
                A quarterly of modern hiring, published in the margins.
              </p>
            </div>
            {[
              { heading: "Sections", items: ["Features", "Pricing"] },
              { heading: "Masthead", items: ["About", "Notes"] },
              { heading: "Colophon", items: ["Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-5">
                  {col.heading}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {col.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="text-foreground/75 hover:text-primary transition-colors"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-foreground/55">
              © 2026 · Resume Matcher · All rights reserved
            </p>
            <p
              style={serif}
              className="text-sm italic text-foreground/55"
            >
              Set in Cormorant Garamond &amp; Geist.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
