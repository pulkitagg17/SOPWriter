import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface HowItWorksSectionProps {
  fadeUp: Variants;
  staggerContainer: Variants;
}

const steps = [
  {
    step: "01",
    title: "Choose your requirement",
    description: "Select the service you need from SOP writing to visa preparation",
  },
  {
    step: "02",
    title: "Get expert assistance",
    description: "Work directly with experienced writers and counselors",
  },
  {
    step: "03",
    title: "Get started",
    description: "Receive your personalized documents and begin your journey to success",
  },
];

export default function HowItWorksSection({ fadeUp, staggerContainer }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get started with your application
          </p>
        </motion.div>

        {/* Desktop: Horizontal Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="hidden md:grid md:grid-cols-3 gap-12 lg:gap-16"
        >
          {steps.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl border-2 border-primary/20 hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: Vertical Steps with Scroll Effect */}
        <div className="md:hidden">
          <div className="space-y-12">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-center space-y-4">
                  {/* Step Number Circle */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl border-2 border-primary/30 shadow-lg shadow-primary/10"
                    whileInView={{ scale: [0.8, 1.05, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {item.step}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
