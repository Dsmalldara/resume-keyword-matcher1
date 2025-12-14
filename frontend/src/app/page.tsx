"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Zap,
  Target,
  Star,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "Match Score Analysis",
    description:
      "Get real-time matching percentage with detailed breakdown against job descriptions",
  },
  {
    icon: Target,
    title: "Keyword Insights",
    description:
      "Discover missing and recommended keywords for better ATS compatibility and relevance",
  },
  {
    icon: Zap,
    title: "Resume Management",
    description:
      "Store multiple resumes with version tracking and organize your job application history",
  },
  {
    icon: Star,
    title: "AI Cover Letters",
    description:
      "Generate customized cover letters tailored to each job description with one click",
  },
  {
    icon: Users,
    title: "Performance Analytics",
    description:
      "Track resume performance metrics and trends across multiple job applications",
  },
  {
    icon: ArrowUpRight,
    title: "Resume History",
    description:
      "View and compare analysis history to optimize your application strategy over time",
  },
];

const stats = [
  { label: "Resumes Analyzed", value: "10,000+" },
  { label: "Success Rate", value: "85%" },
  { label: "Average Match Score", value: "92%" },
];

export default function LandingPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/favicon.svg"
                alt="Resume Matcher Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="hidden sm:inline font-semibold text-foreground">
                Resume Matcher
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-32 min-h-[600px] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Animated floating orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
            animate={{
              y: [0, 40, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <motion.div
            className="absolute top-1/2 right-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
            animate={{
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Floating shapes */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 border-2 border-primary/40 rounded-lg"
            animate={{
              rotate: [0, 360],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-1/4 w-40 h-40 border-2 border-primary/30 rounded-full"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-1/3 right-10 w-28 h-28 bg-primary/15 rounded-full"
            animate={{
              y: [0, 40, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <motion.div
            className="absolute bottom-20 left-1/3 w-36 h-36 border-2 border-primary/25 rounded-lg"
            animate={{
              rotate: [360, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "linear",
              delay: 1.5,
            }}
          />

          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm text-foreground/80">
              Beat the ATS and land your dream job
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Optimize Your Resume,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Match Jobs Better
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Analyze your resume against job descriptions, discover missing
            keywords, get instant match scores, and generate AI-powered cover
            letters. Everything you need to stand out to hiring managers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              onClick={() => router.push("/auth/signup")}
              className="w-full sm:w-auto group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Analyzing Now
              <ArrowRight
                className={`w-4 h-4 ml-2 transition-transform ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Hero Image Placeholder - Demo Preview */}
          <motion.div
            className="relative mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-12 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Resume preview */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Resume Preview
                  </div>
                  <div className="bg-muted rounded-lg h-40 p-4 border border-border/50">
                    <div className="space-y-2">
                      <div className="h-2 bg-foreground/20 rounded w-32"></div>
                      <div className="h-1.5 bg-foreground/10 rounded w-24"></div>
                      <div className="h-1.5 bg-foreground/10 rounded w-20"></div>
                      <div className="mt-4 h-1 bg-foreground/20 rounded w-full"></div>
                      <div className="h-1 bg-foreground/10 rounded w-full"></div>
                      <div className="h-1 bg-foreground/10 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>

                {/* Right side - Analysis results */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Analysis Results
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium text-foreground">
                        Keyword Match
                      </span>
                      <span className="text-sm font-bold text-primary">
                        87%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium text-foreground">
                        ATS Friendly
                      </span>
                      <span className="text-sm font-bold text-primary">
                        92%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium text-foreground">
                        Optimization Tips
                      </span>
                      <span className="text-sm font-bold text-primary">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your resume and maximize your job
              search success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Upload Resume",
                description: "Upload your resume in PDF or DOCX format",
              },
              {
                number: "2",
                title: "Analyze",
                description:
                  "Our AI analyzes your resume and identifies improvements",
              },
              {
                number: "3",
                title: "Optimize",
                description: "Apply recommendations and get hired faster",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary/30">
                    <ArrowRight className="w-full h-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Why Choose Resume Matcher?
              </h2>
              <ul className="space-y-4">
                {[
                  "AI-powered analysis backed by industry experts",
                  "Real-time feedback on resume improvements",
                  "Secure and private - your data stays yours",
                  "Lightning-fast processing",
                  "Continuous updates with new features",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-foreground/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              className="bg-card border border-border rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      Fast & Reliable
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Process your resume in seconds, not hours
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      Accuracy First
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Precision matching with job requirements
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      Premium Support
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Get help when you need it most
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of job seekers who have successfully optimized their
            resumes with Resume Matcher.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/auth/signup")}
              className="w-full sm:w-auto"
            >
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/auth/login")}
              className="w-full sm:w-auto"
            >
              Already have an account?
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 Resume Matcher. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <p className="text-sm text-muted-foreground">
                Built with care for your career
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
