import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface FinalCTASectionProps {
  fadeUp: Variants;
}

export default function FinalCTASection({ fadeUp }: FinalCTASectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Get expert guidance for your international application today
          </p>
          <div className="pt-4">
            <Link to="/wizard">
              <Button size="lg" className="px-10 py-6 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}