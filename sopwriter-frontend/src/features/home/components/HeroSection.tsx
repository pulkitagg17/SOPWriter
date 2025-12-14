import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface HeroSectionProps {
  fadeUp: Variants;
  staggerContainer: Variants;
  slideInRight: Variants;
}

export default function HeroSection({ fadeUp, staggerContainer, slideInRight }: HeroSectionProps) {
  return (
    <section className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            {/* Main Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-foreground">
              Professional SOP & Visa Guidance
              <span className="block text-muted-foreground text-3xl sm:text-4xl lg:text-5xl mt-4 font-medium">
                for International Applications
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp} className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              Expert-written documents and one-to-one guidance for students
              applying abroad.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 justify-center lg:justify-start">
              <Link to="/wizard">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 border-2 font-medium"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Illustration with torn paper effect */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="flex flex-col justify-between mt-0 order-first lg:order-last w-full lg:h-full"
          >
            <div className="relative w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 lg:flex-1">
              {/* Glow effect behind */}
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-lg" />

              {/* Image with torn effect */}
              <div className="relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 w-full h-auto lg:h-full" style={{
                filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                clipPath: `polygon(
                    0% 2%, 3% 0%, 7% 1%, 11% 0%, 16% 2%, 20% 0%, 25% 1%,
                    30% 0%, 35% 2%, 40% 0%, 45% 1%, 50% 0%, 55% 2%,
                    60% 0%, 65% 1%, 70% 0%, 75% 2%, 80% 0%, 85% 1%,
                    90% 0%, 95% 2%, 98% 0%, 100% 1%,
                    100% 98%, 98% 100%, 95% 99%, 90% 100%, 85% 98%,
                    80% 100%, 75% 99%, 70% 100%, 65% 98%, 60% 100%,
                    55% 99%, 50% 100%, 45% 98%, 40% 100%, 35% 99%,
                    30% 100%, 25% 98%, 20% 100%, 15% 99%, 10% 100%,
                    5% 98%, 2% 100%, 0% 99%,
                    1% 50%, 0% 25%, 1% 75%
                  )`
              }}>
                <img
                  src="/Hero.png"
                  alt="Application process"
                  className="w-full h-auto lg:h-full lg:object-cover"
                />
              </div>
            </div>

            {/* Stats filling the empty space on desktop */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="hidden lg:grid grid-cols-3 gap-6 pt-8 border-t border-border/40 mt-8 shrink-0 text-center"
            >
              <motion.div variants={fadeUp}>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Plagiarism Free</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-3xl font-bold text-primary">5k+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Students Guided</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">User Rating</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
