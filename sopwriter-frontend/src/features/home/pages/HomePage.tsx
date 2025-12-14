import { easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import HeroSection from "@/features/home/components/HeroSection";
import HowItWorksSection from "@/features/home/components/HowItWorksSection";
import FinalCTASection from "@/features/home/components/FinalCTASection";
import TrustStrip from "@/features/home/components/TrustStrip";

export default function Home() {
    // Animation Variants
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: easeOut }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: easeOut }
        }
    };

    return (
        <div className="relative overflow-hidden">
            <HeroSection 
                fadeUp={fadeUp} 
                staggerContainer={staggerContainer} 
                slideInRight={slideInRight} 
            />
            
            {/* Visual Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <HowItWorksSection 
                fadeUp={fadeUp} 
                staggerContainer={staggerContainer} 
            />

            {/* Visual Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <FinalCTASection fadeUp={fadeUp} />
            
            <TrustStrip />
        </div>
    );
}